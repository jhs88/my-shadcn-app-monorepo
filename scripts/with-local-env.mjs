import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getLocalSupabaseEnv } from "./lib/supabase-local-env.mjs";

try {
  const cwd = fileURLToPath(new URL("..", import.meta.url));
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getLocalSupabaseEnv({ cwd });
  const [command, ...args] = process.argv.slice(2);
  if (!command)
    throw new Error(
      "Provide a command to run with local Supabase configuration.",
    );
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    },
  });
  process.on("SIGINT", () => child.kill("SIGINT"));
  process.on("SIGTERM", () => child.kill("SIGTERM"));
  child.on("error", (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    process.exitCode = code ?? 1;
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
