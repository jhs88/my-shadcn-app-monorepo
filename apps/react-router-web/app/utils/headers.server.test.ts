import { format, parse } from "@tusbar/cache-control";
import { expect, test } from "vitest";
import { getConservativeCacheControl, pipeHeaders } from "./headers.server";

test("falls back to parent headers when the route has none", () => {
  const parentHeaders = new Headers({
    "Cache-Control": "private, no-store",
    Vary: "Cookie",
    "Server-Timing": "root;dur=1",
    "Set-Cookie": "parent=retained; Path=/",
  });
  const headers = pipeHeaders({
    parentHeaders,
    loaderHeaders: new Headers(),
    actionHeaders: new Headers(),
    errorHeaders: undefined,
  });
  expect(parse(headers.get("Cache-Control") ?? "")).toMatchObject({
    private: true,
    noStore: true,
  });
  for (const name of ["Vary", "Server-Timing", "Set-Cookie"]) {
    expect(headers.get(name)).toBe(parentHeaders.get(name));
  }
});

test("forwards loader cache headers and inherits parent headers", () => {
  const headers = pipeHeaders({
    parentHeaders: new Headers({
      "Cache-Control": "max-age=60",
      Vary: "Accept-Encoding",
      "Server-Timing": "root;dur=1",
      "X-Parent": "retained",
    }),
    loaderHeaders: new Headers({
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
      "Server-Timing": "loader;dur=2",
      Pragma: "no-cache",
      Expires: "0",
    }),
    actionHeaders: new Headers(),
    errorHeaders: undefined,
  });
  expect(parse(headers.get("Cache-Control") ?? "")).toMatchObject({
    private: true,
    noStore: true,
    maxAge: 60,
  });
  expect(headers.get("Vary")?.split(", ").sort()).toEqual([
    "Accept-Encoding",
    "Cookie",
  ]);
  expect(headers.get("Server-Timing")?.split(", ").sort()).toEqual([
    "loader;dur=2",
    "root;dur=1",
  ]);
  expect(headers.get("X-Parent")).toBe("retained");
  expect(headers.get("Pragma")).toBe("no-cache");
  expect(headers.get("Expires")).toBe("0");
});

test("does not discard action headers when a revalidated loader has headers", () => {
  const headers = pipeHeaders({
    parentHeaders: new Headers({ Vary: "Accept-Encoding" }),
    loaderHeaders: new Headers({ "Server-Timing": "loader;dur=2" }),
    actionHeaders: new Headers({
      "Cache-Control": "private, no-store",
      Vary: "Cookie",
      Pragma: "no-cache",
      Expires: "0",
    }),
    errorHeaders: undefined,
  });
  expect(parse(headers.get("Cache-Control") ?? "")).toMatchObject({
    private: true,
    noStore: true,
  });
  expect(headers.get("Vary")).toBe("Accept-Encoding, Cookie");
  expect(headers.get("Server-Timing")).toBe("loader;dur=2");
  expect(headers.get("Pragma")).toBe("no-cache");
  expect(headers.get("Expires")).toBe("0");
});

test("retains private cache policy and parent headers on route errors", () => {
  const headers = pipeHeaders({
    parentHeaders: new Headers({ "Server-Timing": "root;dur=1" }),
    loaderHeaders: new Headers({ "Cache-Control": "private, no-store" }),
    actionHeaders: new Headers(),
    errorHeaders: new Headers({ Vary: "Cookie" }),
  });
  expect(parse(headers.get("Cache-Control") ?? "").noStore).toBe(true);
  expect(headers.get("Server-Timing")).toBe("root;dur=1");
  expect(headers.get("Vary")).toBe("Cookie");
});

test("works for basic usecase", () => {
  const result = getConservativeCacheControl(
    "max-age=3600",
    "max-age=1800, s-maxage=600",
    "private, max-age=86400",
  );

  expect(result).toEqual(
    format({
      maxAge: 1800,
      sharedMaxAge: 600,
      private: true,
    }),
  );
});
test("retains boolean directive", () => {
  const result = parse(
    getConservativeCacheControl("private", "no-cache,no-store"),
  );

  expect(result.private).toBe(true);
  expect(result.noCache).toBe(true);
  expect(result.noStore).toBe(true);
});
test("gets smallest number directive", () => {
  const result = parse(
    getConservativeCacheControl(
      "max-age=10, s-maxage=300",
      "max-age=300, s-maxage=600",
    ),
  );

  expect(result.maxAge).toBe(10);
  expect(result.sharedMaxAge).toBe(300);
});

test("conservatively protects field-specific private and no-cache directives", () => {
  const result = parse(
    getConservativeCacheControl(
      'private="Set-Cookie", max-age=3600',
      'no-cache="Authorization", max-age=60',
    ),
  );
  expect(result.private).toBe(true);
  expect(result.noCache).toBe(true);
  expect(result.maxAge).toBe(60);
});
