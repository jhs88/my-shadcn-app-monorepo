import { type NextConfig } from "next";

export default {
  // Repository-owned agent instructions are maintained independently.
  agentRules: false,
  images: {
    // loader: "custom",
    // loaderFile: "./supabase-image-loader.js",
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "?v=1",
      },
      {
        pathname: "/images/**",
      },
    ],
  },
  serverExternalPackages: ["@supabase/ssr"],
  transpilePackages: ["@repo/ui"],
  output: "standalone",
} satisfies NextConfig;
