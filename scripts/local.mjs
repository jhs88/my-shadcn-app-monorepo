import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { getLocalSupabaseEnv } from "./lib/supabase-local-env.mjs";

const cwd = fileURLToPath(new URL("..", import.meta.url));
const [command, app = "react-router-web"] = process.argv.slice(2);

function run(program, args) {
  execFileSync(program, args, { cwd, stdio: "inherit" });
}

try {
  if (command === "setup") {
    try {
      execFileSync("docker", ["info"], { stdio: "ignore" });
    } catch {
      throw new Error("Start Docker before running pnpm setup:local.");
    }
    run("supabase", [
      "start",
      "--exclude",
      "studio,imgproxy,realtime,edge-runtime,logflare,vector,supavisor",
    ]);
    // Apply pending migrations without deleting existing local data.
    run("supabase", ["migration", "up", "--local"]);
    run("node", ["scripts/bootstrap-playwright-supabase-user.mjs"]);
    console.log(
      "Ready. Run pnpm dev:starter and open http://127.0.0.1:5173/login.",
    );
    console.log(
      process.env.PLAYWRIGHT_TEST_EMAIL || process.env.PLAYWRIGHT_TEST_PASSWORD
        ? "Local demo login uses your PLAYWRIGHT_TEST_EMAIL/PASSWORD overrides."
        : "Local demo login: playwright@example.com / playwright-password-123",
    );
  } else if (command === "dev" && ["web", "react-router-web"].includes(app)) {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = getLocalSupabaseEnv({ cwd });
    const port = app === "web" ? "3000" : "5173";
    const hostFlag = app === "web" ? "--hostname" : "--host";
    const child = spawn(
      "pnpm",
      ["--filter", app, "dev", "--port", port, hostFlag, "127.0.0.1"],
      {
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
      },
    );
    process.on("SIGINT", () => child.kill("SIGINT"));
    process.on("SIGTERM", () => child.kill("SIGTERM"));
    child.on("error", (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    child.on("exit", (code) => {
      process.exitCode = code ?? 1;
    });
  } else {
    throw new Error(
      "Use: node scripts/local.mjs setup | dev [web|react-router-web]",
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
