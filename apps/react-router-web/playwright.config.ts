import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? "4173");
const baseURL =
  process.env.PLAYWRIGHT_TEST_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./playwright/tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm e2e:server",
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    cwd: process.cwd(),
  },
  projects: [
    {
      name: "smoke",
      testMatch: /smoke\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "integration",
      testMatch: /integration\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
