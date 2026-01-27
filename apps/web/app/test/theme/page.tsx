"use client";

import dynamic from "next/dynamic";

const ThemeSelector = dynamic(() => import("@/components/theme-selector"), {
  ssr: false,
});

export default function Page() {
  return <ThemeSelector />;
}
