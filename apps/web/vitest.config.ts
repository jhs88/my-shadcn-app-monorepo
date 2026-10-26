import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react",
    }),
  ],
  resolve: { tsconfigPaths: true },
  test: {
    // Separate CLI processes must not invalidate one another's module cache.
    fsModuleCachePath: fileURLToPath(
      new URL("./node_modules/.vitest-cache", import.meta.url),
    ),
    environment: "jsdom",
    globals: true,
    include: ["app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: ["app/auth/*", "app/test/*"],
    },
  },
});
