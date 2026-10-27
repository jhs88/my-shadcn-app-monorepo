import { config as defaultConfig } from "@repo/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
const config = [
  ...defaultConfig,
  {
    ignores: [
      "**/.cache/**",
      "**/node_modules/**",
      "**/build/**",
      "**/public/**",
      "**/*.json",
      "**/dist/**",
      "**/coverage/**",
      "test-results/**",
      "playwright-report/**",
      "**/*.tsbuildinfo",
      ".react-router/**",
    ],
  },
];

export default config;
