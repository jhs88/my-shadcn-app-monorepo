import { expect, it } from "vitest";
import type { UserConfigFnObject } from "vite";
import configure from "../../vite.config";

it("keeps the Sentry upload options available to the React Router buildEnd hook", () => {
  const config = (configure as UserConfigFnObject)({
    command: "build",
    mode: "production",
  });
  expect(config).toHaveProperty("sentryConfig.release.setCommits.auto", true);
  expect(config).toHaveProperty(
    "sentryConfig.sourcemaps.filesToDeleteAfterUpload",
    ["./build/**/*.map", ".server-build/**/*.map"],
  );
  expect(config).not.toHaveProperty(
    "sentryConfig.unstable_sentryVitePluginOptions",
  );
});
