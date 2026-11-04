import { RouterContextProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as logoutRoute from "./logout";

const { signOut, responseHeaders } = vi.hoisted(() => ({
  signOut: vi.fn(),
  responseHeaders: new Headers(),
}));

vi.mock("~/lib/supabase/server", () => ({
  createClient: () => ({
    supabase: { auth: { signOut } },
    headers: responseHeaders,
  }),
}));

function call({
  method = "post",
  origin,
}: {
  method?: string;
  origin?: string;
} = {}) {
  const url = "http://localhost/logout";
  const request = new Request(url, {
    method,
    headers: origin ? { Origin: origin } : undefined,
  });

  return logoutRoute.action({
    request,
    url: new URL(url),
    context: new RouterContextProvider(),
    params: {},
    pattern: "/logout",
  });
}

beforeEach(() => {
  for (const key of [...responseHeaders.keys()]) responseHeaders.delete(key);
  responseHeaders.set("Cache-Control", "private, no-store");
  signOut.mockResolvedValue({ error: null });
});

describe("logout", () => {
  it("is not reachable through a GET navigation", () => {
    expect((logoutRoute as { loader?: unknown }).loader).toBeUndefined();
  });

  it("signs out and redirects on a same-origin POST", async () => {
    const response = await call({ origin: "http://localhost" });

    expect(signOut).toHaveBeenCalledOnce();
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).status).toBe(302);
    expect((response as Response).headers.get("Location")).toBe("/");
  });

  it("signs out when the browser sends no Origin header", async () => {
    await call();
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("rejects a cross-origin POST before signing the user out", async () => {
    const thrown = await call({ origin: "https://evil.example" }).catch(
      (error) => error,
    );

    expect(signOut).not.toHaveBeenCalled();
    expect(thrown).toBeInstanceOf(Response);
    expect((thrown as Response).status).toBe(403);
  });

  it("reports an auth failure instead of redirecting", async () => {
    signOut.mockResolvedValue({ error: { message: "Sign out failed" } });
    const result = await call();

    if (result instanceof Response)
      throw new Error("Expected an auth failure response");

    const headers = new Headers(result.init?.headers);
    expect(headers.get("Location")).toBeNull();
    expect(headers.get("Cache-Control")).toBe("private, no-store");
  });
});
