import type { User } from "@supabase/supabase-js";
import { RouterContextProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  authenticatedRequestContext,
  createProtectedRouteAuthMiddleware,
  type AuthClientFactory,
  type ServerSupabaseClient,
} from "./protected-route-auth.server";

const request = new Request("http://localhost/protected");

function middlewareArgs(context: RouterContextProvider) {
  return {
    context,
    params: {},
    pattern: "/protected",
    request,
    url: new URL(request.url),
  };
}

describe("protected route auth middleware", () => {
  it("redirects an unauthenticated request without running the route", async () => {
    const headers = new Headers();
    headers.append("Set-Cookie", "expired-session=; Path=/; Max-Age=0");
    const getUser = vi.fn(async () => ({
      data: { user: null },
      error: new Error("Invalid session"),
    }));
    const supabase = {
      auth: { getUser },
    } as unknown as ServerSupabaseClient;
    const createAuthClient = vi.fn(() => ({
      supabase,
      headers,
    })) satisfies AuthClientFactory;
    const middleware = createProtectedRouteAuthMiddleware(createAuthClient);
    const next = vi.fn(async () => new Response("protected"));

    let thrown: unknown;
    try {
      await middleware(middlewareArgs(new RouterContextProvider()), next);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(Response);
    const redirectResponse = thrown as Response;
    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.get("Location")).toBe("/login");
    expect(redirectResponse.headers.getSetCookie()).toEqual([
      "expired-session=; Path=/; Max-Age=0",
    ]);
    expect(createAuthClient).toHaveBeenCalledOnce();
    expect(createAuthClient).toHaveBeenCalledWith(request);
    expect(getUser).toHaveBeenCalledOnce();
    expect(next).not.toHaveBeenCalled();
  });

  it("provides one authenticated user lookup and propagates cookies around the route", async () => {
    const user = {
      id: "user-1",
      email: "person@example.com",
      user_metadata: {},
    } as User;
    const headers = new Headers();
    headers.append("Set-Cookie", "refreshed-session=before; Path=/");
    const getUser = vi.fn(async () => ({
      data: { user },
      error: null,
    }));
    const supabase = {
      auth: { getUser },
    } as unknown as ServerSupabaseClient;
    const createAuthClient = vi.fn(() => ({
      supabase,
      headers,
    })) satisfies AuthClientFactory;
    const middleware = createProtectedRouteAuthMiddleware(createAuthClient);
    const context = new RouterContextProvider();
    const next = vi.fn(async () => {
      expect(context.get(authenticatedRequestContext)).toEqual({
        supabase,
        user,
      });
      headers.append("Set-Cookie", "refreshed-session=after; Path=/");
      return new Response("protected", {
        headers: { "X-Route": "test" },
      });
    });

    const response = await middleware(middlewareArgs(context), next);

    expect(response).toBeInstanceOf(Response);
    expect(response?.headers.get("X-Route")).toBe("test");
    expect(response?.headers.getSetCookie()).toEqual([
      "refreshed-session=before; Path=/",
      "refreshed-session=after; Path=/",
    ]);
    expect(createAuthClient).toHaveBeenCalledOnce();
    expect(createAuthClient).toHaveBeenCalledWith(request);
    expect(getUser).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledOnce();
  });
});
