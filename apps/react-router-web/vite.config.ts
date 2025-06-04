import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterDevTools } from "react-router-devtools";
import { defineConfig } from "vite";
import { envOnlyMacros } from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";
import {
  type SentryReactRouterBuildOptions,
  sentryReactRouter,
} from "@sentry/react-router";

const MODE = process.env.NODE_ENV;

export default defineConfig((config) => ({
  build: {
    target: "es2022",
    cssMinify: MODE === "production",
    sourcemap: true,
  },
  sentryConfig,
  plugins: [
    envOnlyMacros(),
    tailwindcss(),
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
    MODE === "production" && process.env.SENTRY_AUTH_TOKEN
      ? sentryReactRouter(sentryConfig, config)
      : null,
  ],
}));

const sentryConfig: SentryReactRouterBuildOptions = {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  unstable_sentryVitePluginOptions: {
    release: {
      name: process.env.COMMIT_SHA,
      setCommits: {
        auto: true,
      },
    },
    sourcemaps: {
      filesToDeleteAfterUpload: ["./build/**/*.map", ".server-build/**/*.map"],
    },
  },
};
