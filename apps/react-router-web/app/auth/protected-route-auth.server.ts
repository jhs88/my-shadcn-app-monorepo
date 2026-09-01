import type { User } from "@supabase/supabase-js";
import { createContext, redirect, type MiddlewareFunction } from "react-router";
import { createClient } from "~/lib/supabase/server";

export type ServerSupabaseClient = ReturnType<typeof createClient>["supabase"];

export type AuthClientFactory = (request: Request) => {
  supabase: ServerSupabaseClient;
  headers: Headers;
};

export type AuthenticatedRequest = {
  supabase: ServerSupabaseClient;
  user: User;
};

export const authenticatedRequestContext =
  createContext<AuthenticatedRequest>();

function appendHeaders(target: Headers, source: Headers) {
  const getSetCookie = (source as Headers & { getSetCookie?: () => string[] })
    .getSetCookie;

  for (const [name, value] of source) {
    if (name.toLowerCase() !== "set-cookie") {
      target.append(name, value);
    }
  }

  if (getSetCookie) {
    for (const cookie of getSetCookie.call(source)) {
      target.append("Set-Cookie", cookie);
    }
    return;
  }

  const cookie = source.get("Set-Cookie");
  if (cookie) target.append("Set-Cookie", cookie);
}

export function createProtectedRouteAuthMiddleware(
  createAuthClient: AuthClientFactory = createClient,
): MiddlewareFunction<Response> {
  return async ({ context, request }, next) => {
    const { supabase, headers } = createAuthClient(request);
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      throw redirect("/login", { headers });
    }

    context.set(authenticatedRequestContext, {
      supabase,
      user: data.user,
    });

    const response = await next();
    appendHeaders(response.headers, headers);
    return response;
  };
}

export const protectedRouteAuthMiddleware =
  createProtectedRouteAuthMiddleware();
