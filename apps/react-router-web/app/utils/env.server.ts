import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"] as const),
  DATABASE_PATH: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  SESSION_SECRET: z.string().optional(),
  INTERNAL_COMMAND_TOKEN: z.string().optional(),
  HONEYPOT_SECRET: z.string().optional(),
  CACHE_DATABASE_PATH: z.string().optional(),
  // If you plan on using Sentry, remove the .optional()
  SENTRY_DSN: z.string().optional(),
  // If you plan to use Resend, remove the .optional()
  RESEND_API_KEY: z.string().optional(),
  // If you plan to use GitHub auth, remove the .optional()
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  GITHUB_REDIRECT_URI: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),

  ALLOW_INDEXING: z.enum(["true", "false"]).optional(),

  // Tigris Object Storage Configuration
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ENDPOINT_URL_S3: z.string().url().optional(),
  BUCKET_NAME: z.string().optional(),

  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  VITE_SUPABASE_URL: z.string().optional(),
  VITE_SUPABASE_ANON_KEY: z.string().optional(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function init() {
  const parsed = schema.safeParse(process.env);

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );

    throw new Error("Invalid environment variables");
  }
}

/**
 * This is used in both `entry.server.ts` and `root.tsx` to ensure that the
 * environment variables are set and globally available before the app is
 * started.
 *
 * NOTE: Do _not_ add any environment variables in here that you do not wish to
 * be included in the client.
 *
 * @returns All public ENV variables
 */
export function getEnv() {
  return {
    MODE: process.env.NODE_ENV,
    SENTRY_DSN: process.env.SENTRY_DSN,
    ALLOW_INDEXING: process.env.ALLOW_INDEXING,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
  interface Window {
    ENV: ENV;
  }
}
