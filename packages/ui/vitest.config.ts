import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    // Separate CLI processes must not invalidate one another's module cache.
    fsModuleCachePath: fileURLToPath(
      new URL("./node_modules/.vitest-cache", import.meta.url),
    ),
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
