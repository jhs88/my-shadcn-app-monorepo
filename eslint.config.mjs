import { config as baseConfig } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
const config = [
  ...baseConfig,
  {
    ignores: [
      "**/.turbo/**",
      "**/.cache/**",
      "**/node_modules/**",
      "**/*.tsbuildinfo",
      "**/*.json",
    ],
  },
];

export default config;
