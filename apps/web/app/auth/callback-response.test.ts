// @vitest-environment node
import { NextRequest, type NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as confirm } from "./confirm/route";
import { GET as oauth } from "./oauth/route";

type AuthResult = { error: { message: string } | null };
const { createClient, verifyOtp, exchangeCodeForSession } = vi.hoisted(() => ({
  createClient: vi.fn<(headers: Headers) => Promise<unknown>>(),
  verifyOtp: vi.fn<() => Promise<AuthResult>>(),
  exchangeCodeForSession: vi.fn<() => Promise<AuthResult>>(),
}));
vi.mock("@/lib/supabase/server", () => ({ createClient }));

const origin = "https://app.example:8443";
const sessionCookies = [
  "session.0=first; Path=/; HttpOnly; Secure; SameSite=Lax",
  "session.1=second; Path=/; HttpOnly; Secure; SameSite=Lax",
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("NODE_ENV", "production");
  verifyOtp.mockResolvedValue({ error: null });
  exchangeCodeForSession.mockResolvedValue({ error: null });
  createClient.mockImplementation(async (headers: Headers) => {
    headers.set("Cache-Control", "private, no-store");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    sessionCookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
    return { auth: { verifyOtp, exchangeCodeForSession } };
  });
});

afterEach(() => vi.unstubAllEnvs());

function expectAuthHeaders(response: NextResponse) {
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  expect(response.headers.get("pragma")).toBe("no-cache");
  expect(response.headers.get("expires")).toBe("0");
  expect(response.headers.getSetCookie()).toEqual(sessionCookies);
}

describe.each([
  {
    name: "confirm",
    handler: confirm,
    path: "/auth/confirm",
    credentials: "token_hash=test&type=email",
  },
  {
    name: "oauth",
    handler: oauth,
    path: "/auth/oauth",
    credentials: "code=test",
  },
])("$name callback", ({ name, handler, path, credentials }) => {
  function request(next?: string, headers?: HeadersInit) {
    const url = new URL(`${path}?${credentials}`, origin);
    if (next !== undefined) url.searchParams.set("next", next);
    return new NextRequest(url, { headers });
  }

  it.each([
    "/protected",
    "/auth/update-password?mode=recovery#password",
    "/projects/new?name=hello%20world&sort=desc#details",
    "/files/a%2Fb",
    "/files//photo",
    "/protected?return=https%3A%2F%2Fdocs.example%2F#details",
    "/search?pattern=%5Cd%2B#results",
    "/protected?file=a\\b#details",
    "protected?tab=profile#details",
    "@evil.example/path",
    ".evil.example/path",
    "../protected?tab=profile#details",
    "?tab=profile#details",
    "#details",
  ])("preserves the relative destination %j and auth headers", async (next) => {
    const callbackRequest = request(next);
    const response = await handler(callbackRequest);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      new URL(next, callbackRequest.url).href,
    );
    expectAuthHeaders(response);
  });

  it.each([
    "https://evil.example/steal",
    "https://app.example:8443/protected",
    "http://evil.example/steal",
    "javascript:alert(1)",
    "//evil.example/steal",
    "///evil.example/steal",
    "\\\\evil.example/steal",
    "/\\evil.example/steal",
    "/safe\\..\\evil.example",
    " https://evil.example/steal",
    " /protected",
    "/protected ",
    "/\t/evil.example/steal",
    "/\n/evil.example/steal",
    "/protected\r\nLocation: https://evil.example",
    "/protected\u0000",
    "/%2fevil.example/steal",
    "%2f%2fevil.example/steal",
    "/%5cevil.example/steal",
    "/%09/evil.example/steal",
    "/%0a/evil.example/steal",
    "/protected%00",
    "/protected%zz",
    "/protected%",
    "/%E0%A4%A",
    "/safe/..//evil.example/steal",
  ])("falls back to the same-origin root for unsafe next=%j", async (next) => {
    const response = await handler(request(next));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(`${origin}/`);
    expectAuthHeaders(response);
  });

  it.each([undefined, ""])(
    "uses the root fallback for next=%j",
    async (next) => {
      const response = await handler(request(next));
      expect(response.headers.get("location")).toBe(`${origin}/`);
      expectAuthHeaders(response);
    },
  );

  it.each(["development", "production"])(
    "ignores an untrusted forwarded host in %s",
    async (environment) => {
      vi.stubEnv("NODE_ENV", environment);
      const response = await handler(
        request("/protected?tab=profile#details", {
          "x-forwarded-host": "evil.example",
          "x-forwarded-proto": "http",
        }),
      );
      expect(response.headers.get("location")).toBe(
        `${origin}/protected?tab=profile#details`,
      );
      expectAuthHeaders(response);
    },
  );

  it("preserves auth cookies and cache headers on an auth failure", async () => {
    verifyOtp.mockResolvedValue({ error: { message: "Invalid token" } });
    exchangeCodeForSession.mockResolvedValue({
      error: { message: "Invalid token" },
    });
    const response = await handler(
      request("//evil.example", { "x-forwarded-host": "evil.example" }),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${origin}/auth/error${name === "confirm" ? "?error=Invalid%20token" : ""}`,
    );
    expectAuthHeaders(response);
  });

  it("keeps the existing error fallback when credentials are missing", async () => {
    const url = new URL(path, origin);
    url.searchParams.set("next", "//evil.example");
    const response = await handler(
      new NextRequest(url, { headers: { "x-forwarded-host": "evil.example" } }),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      `${origin}/auth/error${name === "confirm" ? "?error=No%20token%20hash%20or%20type" : ""}`,
    );
    expect(createClient).not.toHaveBeenCalled();
  });
});
