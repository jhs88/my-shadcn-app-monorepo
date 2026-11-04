import { parse } from "@tusbar/cache-control";
import {
  createRequestHandler,
  data,
  RouterContextProvider,
  type ServerBuild,
} from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { pipeHeaders } from "~/utils/headers.server";
import * as protectedRoute from "./protected";
import * as testRoute from "./test";
import * as loginRoute from "./login";
import * as signUpRoute from "./sign-up";
import * as forgotPasswordRoute from "./forgot-password";
import * as updatePasswordRoute from "./update-password";
import * as logoutRoute from "./logout";
import * as healthcheckRoute from "./resources.healthcheck";

const { authHeaders, authError } = vi.hoisted(() => ({
  authHeaders: new Headers(),
  authError: { message: "Example auth failure" },
}));

vi.mock("~/lib/supabase/server", () => ({
  createClient: () => ({
    headers: authHeaders,
    supabase: {
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "user-1",
              email: "person@example.com",
              user_metadata: {},
            },
          },
          error: null,
        }),
        signInWithPassword: async () => ({ error: authError }),
        signUp: async () => ({ error: authError }),
        resetPasswordForEmail: async () => ({ error: authError }),
        updateUser: async () => ({ error: authError }),
        signOut: async () => ({ error: authError }),
      },
      from: () => ({ select: () => ({ filter: async () => ({ data: [] }) }) }),
    },
  }),
}));

// Exercise the framework's document and single-fetch response assembly without
// rendering the UI or loading root environment configuration.
const build: ServerBuild = {
  entry: {
    module: {
      default: (_request, status, headers) =>
        new Response("document", { status, headers }),
    },
  },
  routes: {
    root: {
      id: "root",
      path: "",
      module: {
        default: () => null,
        loader: () =>
          data(null, {
            headers: { "Server-Timing": "root;dur=1", Vary: "Accept-Encoding" },
          }),
        headers: pipeHeaders,
      },
    },
    protected: {
      id: "protected",
      parentId: "root",
      path: "protected",
      module: { ...protectedRoute, default: () => null },
    },
    test: {
      id: "test",
      parentId: "root",
      path: "test",
      module: { ...testRoute, default: () => null },
    },
    login: { id: "login", parentId: "root", path: "login", module: loginRoute },
    signUp: {
      id: "signUp",
      parentId: "root",
      path: "sign-up",
      module: signUpRoute,
    },
    forgot: {
      id: "forgot",
      parentId: "root",
      path: "forgot-password",
      module: forgotPasswordRoute,
    },
    update: {
      id: "update",
      parentId: "root",
      path: "update-password",
      module: updatePasswordRoute,
    },
    logout: {
      id: "logout",
      parentId: "root",
      path: "logout",
      module: { ...logoutRoute, default: () => null },
    },
  },
  assets: {
    entry: { imports: [], module: "" },
    routes: {},
    url: "/manifest.js",
    version: "test",
  },
  publicPath: "/",
  assetsBuildDirectory: "build/client",
  future: {},
  ssr: true,
  isSpaMode: false,
  prerender: [],
  routeDiscovery: { mode: "initial", manifestPath: "/__manifest" },
};
const handleRequest = createRequestHandler(build, "test");

beforeEach(() => {
  for (const key of [...authHeaders.keys()]) authHeaders.delete(key);
});

function expectPrivate(response: Response) {
  expect(response.status).toBe(200);
  expect(parse(response.headers.get("Cache-Control") ?? "")).toMatchObject({
    private: true,
    noStore: true,
  });
}

for (const suffix of ["", ".data"]) {
  describe(suffix ? "navigation responses" : "document responses", () => {
    it.each(["protected", "test"])(
      "marks /%s private even without a session refresh",
      async (path) => {
        const response = await handleRequest(
          new Request(`http://localhost/${path}${suffix}`),
        );
        expectPrivate(response);
        expect(response.headers.get("Server-Timing")).toContain("root;dur=1");
        expect(response.headers.get("Vary")).toContain("Accept-Encoding");
      },
    );

    it("preserves session refresh headers around a private loader", async () => {
      authHeaders.set("Cache-Control", "private, no-store");
      authHeaders.set("Pragma", "no-cache");
      authHeaders.set("Expires", "0");
      authHeaders.append("Set-Cookie", "session=one; Path=/");
      authHeaders.append("Set-Cookie", "refresh=two; Path=/");
      const response = await handleRequest(
        new Request(`http://localhost/protected${suffix}`),
      );
      expectPrivate(response);
      expect(response.headers.getSetCookie()).toEqual(
        authHeaders.getSetCookie(),
      );
      expect(response.headers.get("Pragma")).toBe("no-cache");
      expect(response.headers.get("Expires")).toBe("0");
      expect(response.headers.get("Server-Timing")).toContain("root;dur=1");
    });

    it.each([
      [
        "login",
        "submission=credentials&email=person%40example.com&password=ValidPassword123!",
      ],
      [
        "sign-up",
        "email=person%40example.com&password=ValidPassword123!&repeat-password=ValidPassword123!",
      ],
      ["forgot-password", "email=person%40example.com"],
      ["update-password", "password=ValidPassword123!"],
    ])(
      "preserves /%s action auth headers on non-redirect errors",
      async (path, body) => {
        authHeaders.set("Cache-Control", "private, no-store");
        authHeaders.set("Pragma", "no-cache");
        authHeaders.set("Expires", "0");
        authHeaders.append("Set-Cookie", "session=one; Path=/");
        authHeaders.append("Set-Cookie", "refresh=two; Path=/");
        const response = await handleRequest(
          new Request(`http://localhost/${path}${suffix}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          }),
        );
        expectPrivate(response);
        expect(response.headers.getSetCookie()).toEqual(
          authHeaders.getSetCookie(),
        );
        expect(response.headers.get("Pragma")).toBe("no-cache");
        expect(response.headers.get("Expires")).toBe("0");
        // Single-fetch POSTs execute only the action, not parent loaders.
        if (!suffix) {
          expect(response.headers.get("Server-Timing")).toContain("root;dur=1");
          expect(response.headers.get("Vary")).toContain("Accept-Encoding");
        }
      },
    );
  });
}

it("preserves logout action auth headers during navigation on errors", async () => {
  authHeaders.set("Cache-Control", "private, no-store");
  authHeaders.append("Set-Cookie", "session=; Path=/; Max-Age=0");
  const response = await handleRequest(
    new Request("http://localhost/logout.data", { method: "post" }),
  );
  expectPrivate(response);
  expect(response.headers.getSetCookie()).toEqual(authHeaders.getSetCookie());
});

it("preserves logout action auth headers on errors", async () => {
  authHeaders.set("Cache-Control", "private, no-store");
  authHeaders.append("Set-Cookie", "session=; Path=/; Max-Age=0");
  const request = new Request("http://localhost/logout", { method: "post" });
  const result = await logoutRoute.action({
    request,
    url: new URL(request.url),
    context: new RouterContextProvider(),
    params: {},
    pattern: "/logout",
  });
  expect(result).not.toBeInstanceOf(Response);
  if (result instanceof Response) throw new Error("Expected auth failure data");
  const headers = new Headers(result.init?.headers);
  expect(headers.get("Cache-Control")).toBe("private, no-store");
  expect(headers.getSetCookie()).toEqual(authHeaders.getSetCookie());
});

it("leaves the public health resource cache policy unchanged", async () => {
  const response = await healthcheckRoute.loader();
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toBeNull();
});
