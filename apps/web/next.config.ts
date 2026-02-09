import { type NextConfig } from "next";

export default {
  images: {
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
