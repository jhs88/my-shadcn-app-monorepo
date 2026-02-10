"use client";

import { getQueryClient } from "@/app/get-query-client";
import { ActiveThemeProvider } from "@/components/themes/active-theme";
import { QueryClientProvider } from "@tanstack/react-query";

export default function Providers({
  activeThemeValue,
  children,
}: React.PropsWithChildren<{
  activeThemeValue: string;
}>) {
  // NOTE:  Avoid useState when initializing the query client if you don't
  //        have a suspense boundary between this and the code that may
  //        suspend because React will throw away the client on the initial
  //        render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ActiveThemeProvider>
  );
}
