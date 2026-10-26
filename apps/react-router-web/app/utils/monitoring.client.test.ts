import { afterEach, expect, it, vi } from "vitest";
const { initialize } = vi.hoisted(() => ({ initialize: vi.fn() }));
vi.mock("@sentry/react-router", () => ({
  init: initialize,
  replayIntegration: () => ({ name: "replay" }),
  browserProfilingIntegration: () => ({ name: "profiling" }),
}));
import { init } from "./monitoring.client";

afterEach(() => vi.unstubAllGlobals());

it("preserves v10 data collection, tracing, and sampling after the SDK upgrade", () => {
  vi.stubGlobal("ENV", { SENTRY_DSN: "", MODE: "test" });
  init();
  expect(initialize).toHaveBeenCalledWith(
    expect.objectContaining({
      traceLifecycle: "static",
      tracesSampleRate: 1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      dataCollection: expect.objectContaining({
        userInfo: false,
        cookies: false,
        httpBodies: [],
        databaseQueryData: false,
        genAI: { inputs: false, outputs: false },
        graphQL: { document: false, variables: false },
        frameContextLines: 7,
      }),
    }),
  );
});
