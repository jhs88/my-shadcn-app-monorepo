"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { getQueryClient } from "@/app/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // NOTE:  Avoid useState when initializing the query client if you don't
  //        have a suspense boundary between this and the code that may
  //        suspend because React will throw away the client on the initial
  //        render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <NextThemesProvider
      attribute="class"
      storageKey="theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
}
