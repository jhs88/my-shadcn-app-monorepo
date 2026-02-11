import Providers from "@/components/providers";
import { fontVariables } from "@/components/themes/fonts.confg";
import ThemeProvider from "@/components/themes/theme-provider";
import { DEFAULT_THEME } from "@/components/themes/theme.config";
import { Toaster } from "@repo/ui/components/sonner";
import { cn } from "@repo/ui/lib/utils";
import { type Viewport, type Metadata } from "next";
import { cookies } from "next/headers";

import "@repo/ui/themes.css";

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  title: { default: "Shadcn UI", template: "%s | Shadcn UI" },
  description: "A Shadcn UI Example",
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const themeToApply = activeThemeValue ?? DEFAULT_THEME;

  return (
    <html lang="en" suppressHydrationWarning data-theme={themeToApply}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Set meta theme color
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overflow-hidden overscroll-none font-sans antialiased",
          fontVariables,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={themeToApply}>
            <Toaster />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
