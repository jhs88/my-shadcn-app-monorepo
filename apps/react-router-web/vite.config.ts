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

		rollupOptions: {
			external: [/node:.*/, 'fsevents'],
		},

		assetsInlineLimit: (source: string) => {
			if (
				source.endsWith('favicon.svg') ||
				source.endsWith('apple-touch-icon.png')
			) {
				return false
			}
		},

    sourcemap: true,
  },
  sentryConfig,
  plugins: [
    envOnlyMacros(),
    tailwindcss(),
    reactRouterDevTools(),
    // it would be really nice to have this enabled in tests, but we'll have to
    // wait until https://github.com/remix-run/remix/issues/9871 is fixed
    MODE === "test" ? null : reactRouter(),
    MODE === "production" && process.env.SENTRY_AUTH_TOKEN
      ? sentryReactRouter(sentryConfig, config)
      : null,
    tsconfigPaths(),
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
