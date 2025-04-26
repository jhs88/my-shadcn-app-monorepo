import { type NextConfig } from "next";

export default {
  transpilePackages: ["@repo/ui"],
  output: "standalone",
} satisfies NextConfig;
