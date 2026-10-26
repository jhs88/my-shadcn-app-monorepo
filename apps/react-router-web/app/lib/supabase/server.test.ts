import type { CookieOptions } from "@supabase/ssr";
import { beforeEach, expect, it, vi } from "vitest";

const { createServerClient } = vi.hoisted(() => ({
  createServerClient: vi.fn(),
}));
vi.mock("@supabase/ssr", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@supabase/ssr")>()),
  createServerClient,
}));
import { createClient } from "./server";

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:54321");
  vi.stubEnv("SUPABASE_ANON_KEY", "local-test-key");
});

it("returns refreshed cookies together with Supabase's cache protection headers", () => {
  const { headers } = createClient(new Request("http://localhost/protected"));
  const options = createServerClient.mock.calls.at(-1)?.[2] as {
    cookies: {
      setAll: (
        cookies: { name: string; value: string; options: CookieOptions }[],
        headers: Record<string, string>,
      ) => void;
    };
  };
  options.cookies.setAll(
    [
      {
        name: "session.0",
        value: "first",
        options: { path: "/", httpOnly: true },
      },
      { name: "session.1", value: "second", options: { path: "/" } },
    ],
    { "Cache-Control": "private, no-store", Pragma: "no-cache", Expires: "0" },
  );

  expect(headers.getSetCookie()).toEqual([
    "session.0=first; Path=/; HttpOnly",
    "session.1=second; Path=/",
  ]);
  expect(headers.get("Cache-Control")).toBe("private, no-store");
  expect(headers.get("Pragma")).toBe("no-cache");
  expect(headers.get("Expires")).toBe("0");
});
