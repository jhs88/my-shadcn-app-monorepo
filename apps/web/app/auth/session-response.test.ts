// @vitest-environment node
import type { CookieOptions } from "@supabase/ssr";
import { NextRequest } from "next/server";
import { beforeEach, expect, it, vi } from "vitest";
import { updateSession } from "@/lib/supabase/middleware";

const { createServerClient, getUser } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
  getUser: vi.fn(),
}));
vi.mock("@supabase/ssr", () => ({ createServerClient }));

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "local-test-key");
  createServerClient.mockImplementation(
    (
      _url,
      _key,
      options: {
        cookies: {
          setAll: (
            cookies: { name: string; value: string; options: CookieOptions }[],
            headers: Record<string, string>,
          ) => void;
        };
      },
    ) => ({
      auth: {
        getUser: async () => {
          options.cookies.setAll(
            [
              {
                name: "session.0",
                value: "first",
                options: { path: "/", httpOnly: true },
              },
              { name: "session.1", value: "second", options: { path: "/" } },
            ],
            {
              "Cache-Control": "private, no-store",
              Pragma: "no-cache",
              Expires: "0",
            },
          );
          // Supabase supplies cache headers only on the first write per client.
          options.cookies.setAll(
            [{ name: "session.1", value: "updated", options: { path: "/" } }],
            {},
          );
          return getUser();
        },
      },
    }),
  );
});

it.each([true, false])(
  "preserves refresh cookies and cache headers when authenticated=%s",
  async (authenticated) => {
    getUser.mockResolvedValue({
      data: { user: authenticated ? { id: "user-1" } : null },
    });
    const request = new NextRequest("http://localhost/protected");
    const response = await updateSession(request);

    expect(response.status).toBe(authenticated ? 200 : 307);
    if (!authenticated)
      expect(response.headers.get("location")).toBe(
        "http://localhost/auth/login",
      );
    expect(response.cookies.get("session.0")?.value).toBe("first");
    expect(response.cookies.get("session.1")?.value).toBe("updated");
    expect(request.cookies.get("session.0")?.value).toBe("first");
    expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    expect(response.headers.get("Pragma")).toBe("no-cache");
    expect(response.headers.get("Expires")).toBe("0");
  },
);
