import "dotenv/config";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getLocalSupabaseEnv } from "../../scripts/lib/supabase-local-env.mjs";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = getLocalSupabaseEnv({
  cwd: fileURLToPath(new URL("../..", import.meta.url)),
});

const port = process.env.PORT ?? "4173";
const baseUrl =
  process.env.PLAYWRIGHT_TEST_BASE_URL ?? `http://127.0.0.1:${port}`;

const child = spawn(
  "pnpm",
  ["exec", "react-router", "dev", "--host", "127.0.0.1", "--port", port],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      NODE_ENV: "development",
      PORT: port,
      PLAYWRIGHT_TEST_BASE_URL: baseUrl,
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    },
  },
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
