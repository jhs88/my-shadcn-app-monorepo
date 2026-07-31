import { execFileSync } from "node:child_process";

function parseEnvOutput(output) {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((env, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) return env;

      const key = line.slice(0, separatorIndex);
      const rawValue = line.slice(separatorIndex + 1);
      const value = rawValue.replace(/^["']|["']$/g, "");

      env[key] = value;
      return env;
    }, {});
}

export function getLocalSupabaseEnv({ cwd = process.cwd() } = {}) {
  const explicit = {
    SUPABASE_URL: process.env.PLAYWRIGHT_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.PLAYWRIGHT_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY,
  };

  if (
    explicit.SUPABASE_URL &&
    explicit.SUPABASE_ANON_KEY &&
    explicit.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return explicit;
  }

  let output;

  try {
    output = execFileSync("supabase", ["status", "-o", "env"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    throw new Error(
      "Unable to read local Supabase credentials. Start Supabase with `supabase start`, or provide PLAYWRIGHT_SUPABASE_URL, PLAYWRIGHT_SUPABASE_ANON_KEY, and PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY.",
      { cause: error },
    );
  }

  const env = parseEnvOutput(output);

  if (!env.API_URL || !env.ANON_KEY || !env.SERVICE_ROLE_KEY || !env.DB_URL) {
    throw new Error(
      "Local Supabase is running, but `supabase status -o env` did not return API_URL, ANON_KEY, SERVICE_ROLE_KEY, and DB_URL.",
    );
  }

  return {
    SUPABASE_URL: env.API_URL,
    SUPABASE_ANON_KEY: env.ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: env.SERVICE_ROLE_KEY,
    SUPABASE_DB_URL: env.DB_URL,
  };
}
