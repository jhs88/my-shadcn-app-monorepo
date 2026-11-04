// @vitest-environment node
import { describe, expect, it } from "vitest";
import { config } from "./proxy";
import { isProtectedPath } from "./lib/supabase/middleware";

const matchers = config.matcher.map((pattern) => new RegExp(`^${pattern}$`));

const isMatched = (pathname: string) =>
  matchers.some((matcher) => matcher.test(pathname));

describe("proxy matcher", () => {
  it.each(["/", "/test", "/protected", "/protected/details", "/auth/confirm"])(
    "refreshes the session on %s",
    (pathname) => {
      expect(isMatched(pathname)).toBe(true);
    },
  );

  it.each([
    "/_next/static/chunks/app.js",
    "/_next/image?url=%2Flogo.png",
    "/favicon.ico",
    "/logo.svg",
    "/photo.png",
  ])("leaves the static asset %s alone", (pathname) => {
    expect(isMatched(pathname)).toBe(false);
  });
});

describe("isProtectedPath", () => {
  it.each(["/test", "/protected", "/protected/details"])(
    "requires a session on %s",
    (pathname) => {
      expect(isProtectedPath(pathname)).toBe(true);
    },
  );

  it.each([
    "/",
    "/auth/login",
    "/auth/confirm",
    "/auth/update-password",
    "/testbed",
    "/protectedness",
  ])("keeps %s public", (pathname) => {
    expect(isProtectedPath(pathname)).toBe(false);
  });
});
