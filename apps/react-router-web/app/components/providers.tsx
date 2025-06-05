import * as React from "react";
import { type Theme, ThemeProvider } from "remix-themes";

export function Providers({
  theme,
  children,
}: React.PropsWithChildren<{
  theme: Theme;
}>) {
  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/action/set-theme">
      {children}
    </ThemeProvider>
  );
}
