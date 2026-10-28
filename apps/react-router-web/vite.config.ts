import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { envOnlyMacros } from "vite-env-only";
import { configDefaults, defineConfig } from "vitest/config";
import {
  type SentryReactRouterBuildOptions,
  sentryReactRouter,
} from "@sentry/react-router/vite";

const MODE = process.env.NODE_ENV;

export default defineConfig((config) => ({
  resolve: { tsconfigPaths: true },
  test: {
    // Separate CLI processes must not invalidate one another's module cache.
    fsModuleCachePath: fileURLToPath(
      new URL("./node_modules/.vitest-cache", import.meta.url),
    ),
    include: ["app/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "playwright/**"],
  },
  preview: {
    host: "127.0.0.1",
  },
  build: {
    target: "es2022",
    cssMinify: MODE === "production",

    rolldownOptions: {
      external: [/node:.*/, "fsevents"],
    },

    assetsInlineLimit: (source: string) => {
      if (
        source.endsWith("favicon.svg") ||
        source.endsWith("apple-touch-icon.png")
      ) {
        return false;
      }
    },

    // sourcemap: true,
  },
  // The Sentry buildEnd hook reads these upload options from the resolved config.
  sentryConfig,
  plugins: [
    envOnlyMacros(),
    tailwindcss(),
    // it would be really nice to have this enabled in tests, but we'll have to
    // wait until https://github.com/remix-run/remix/issues/9871 is fixed
    MODE === "test" ? null : reactRouter(),
    MODE === "production" && process.env.SENTRY_AUTH_TOKEN
      ? sentryReactRouter(sentryConfig, config)
      : null,
  ],
}));

const sentryConfig: SentryReactRouterBuildOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  release: {
    name: process.env.COMMIT_SHA,
    setCommits: {
      auto: true,
    },
  },
  sourcemaps: {
    filesToDeleteAfterUpload: ["./build/**/*.map", ".server-build/**/*.map"],
  },
};
