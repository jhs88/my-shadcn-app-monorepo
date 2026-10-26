// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, expect, it, vi } from "vitest";
import { GET as confirm } from "./confirm/route";
import { GET as oauth } from "./oauth/route";
const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient }));

beforeEach(() => {
  createClient.mockImplementation(async (headers: Headers) => {
    headers.set("Cache-Control", "private, no-store");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    return {
      auth: {
        verifyOtp: async () => ({ error: null }),
        exchangeCodeForSession: async () => ({ error: null }),
      },
    };
  });
});

it.each([
  [
    "confirm",
    "http://localhost/auth/confirm?token_hash=test&type=email&next=/protected",
  ],
  ["oauth", "http://localhost/auth/oauth?code=test&next=/protected"],
])(
  "keeps Supabase cache protection on the %s callback redirect",
  async (flow, url) => {
    const response = await (flow === "confirm" ? confirm : oauth)(
      new NextRequest(url),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/protected");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(response.headers.get("pragma")).toBe("no-cache");
    expect(response.headers.get("expires")).toBe("0");
  },
);
