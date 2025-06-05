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
      "**/*.tsbuildinfo",
      ".react-router/**",
    ],
  },
];

export default config;
