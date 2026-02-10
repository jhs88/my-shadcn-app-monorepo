// "use client";

import { ThemeModeToggle } from "@/components/themes/theme-mode-toggle";
import ThemeSelector from "@/components/themes/theme-selector";
import dynamic from "next/dynamic";

// const ThemeSelector = dynamic(
//   () => import("@/components/themes/theme-selector"),
//   {
//     ssr: false,
//   },
// );

export default function Page() {
  return (
    <div className="flex gap-2">
      <ThemeModeToggle />
      <ThemeSelector />
    </div>
  );
}
