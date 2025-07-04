import { type NextConfig } from "next";

export default {
  serverExternalPackages: ["@supabase/ssr"],
  transpilePackages: ["@repo/ui"],
  output: "standalone",
} satisfies NextConfig;
