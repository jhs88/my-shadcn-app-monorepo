import { RouterContextProvider } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loader as confirm } from "./auth.confirm";
import { loader as oauth } from "./auth.oauth";

const { verifyOtp, exchangeCodeForSession, responseHeaders } = vi.hoisted(
  () => ({
    verifyOtp: vi.fn(),
    exchangeCodeForSession: vi.fn(),
    responseHeaders: new Headers(),
  }),
);

vi.mock("~/lib/supabase/server", () => ({
  createClient: () => ({
    supabase: { auth: { verifyOtp, exchangeCodeForSession } },
    headers: responseHeaders,
  }),
}));

beforeEach(() => {
  responseHeaders.set("Cache-Control", "private, no-store");
  responseHeaders.set("Pragma", "no-cache");
  responseHeaders.set("Expires", "0");
  responseHeaders.delete("Set-Cookie");
  responseHeaders.append("Set-Cookie", "session=one; Path=/; HttpOnly");
  responseHeaders.append("Set-Cookie", "refresh=two; Path=/; HttpOnly");
  verifyOtp.mockResolvedValue({ error: null });
  exchangeCodeForSession.mockResolvedValue({ error: null });
});

for (const [name, loader, query] of [
  ["confirm", confirm, "token_hash=token&type=email"],
  ["oauth", oauth, "code=code"],
] as const) {
  describe(`${name} callback`, () => {
    async function call(next: string | null, credentials: string = query) {
      const url = new URL(`http://localhost/auth/${name}?${credentials}`);
      if (next !== null) url.searchParams.set("next", next);
      return loader({
        request: new Request(url),
        url,
        context: new RouterContextProvider(),
        params: {},
        pattern: `/auth/${name}`,
      });
    }

    it.each([
      null,
      "",
      "https://outside.example/path",
      "//outside.example/path",
      "///outside.example/path",
      "/\\outside.example/path",
      "\\\\outside.example/path",
      "/\t/outside.example/path",
      "/\n/outside.example/path",
    ])("falls back for unsafe or missing next %j", async (next) => {
      const response = await call(next);
      expect(response.headers.get("Location")).toBe("/");
    });

    it.each([
      "/",
      "/protected",
      "/projects?tab=mine#recent",
      "/a/b",
      "/%2Fpath",
    ])("keeps app path %j and auth response headers", async (next) => {
      const response = await call(next);
      expect(response.headers.get("Location")).toBe(next);
      expect(response.headers.getSetCookie()).toEqual(
        responseHeaders.getSetCookie(),
      );
      for (const header of ["Cache-Control", "Pragma", "Expires"]) {
        expect(response.headers.get(header)).toBe(responseHeaders.get(header));
      }
    });

    it("preserves cookies and cache headers on auth failure", async () => {
      const error = { message: "Invalid token" };
      verifyOtp.mockResolvedValue({ error });
      exchangeCodeForSession.mockResolvedValue({ error });
      const response = await call("/protected");
      expect(response.headers.get("Location")).toContain("/auth/error?error=");
      expect(response.headers.getSetCookie()).toEqual(
        responseHeaders.getSetCookie(),
      );
      expect(response.headers.get("Cache-Control")).toBe("private, no-store");
    });

    it("handles missing credentials without attempting auth", async () => {
      verifyOtp.mockClear();
      exchangeCodeForSession.mockClear();
      const response = await call("/protected", "");
      expect(response.headers.get("Location")).toContain("/auth/error");
      expect(verifyOtp).not.toHaveBeenCalled();
      expect(exchangeCodeForSession).not.toHaveBeenCalled();
    });
  });
}
