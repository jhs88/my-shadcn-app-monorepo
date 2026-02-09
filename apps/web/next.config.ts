import { type NextConfig } from "next";

export default {
  images: {
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "?v=1",
      },
    ],
  },
  serverExternalPackages: ["@supabase/ssr"],
  transpilePackages: ["@repo/ui"],
  output: "standalone",
} satisfies NextConfig;
