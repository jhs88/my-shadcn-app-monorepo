import "@repo/ui/globals.css";
import type { LinksFunction } from "react-router";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import { GeneralErrorBoundary } from "~/components/error-boundary";
import { Toaster } from "~/components/ui/sonner";
import { getEnv } from "~/utils/env.server";
import { pipeHeaders } from "~/utils/headers.server";
import { combineHeaders, getDomainUrl } from "~/utils/misc";
import { useNonce } from "~/utils/nonce-provider";
import { themeSessionResolver } from "~/utils/theme.server";
import { makeTimings } from "~/utils/timing.server";
import type { Route } from "./+types/root";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=block",
  },
  // {
  //   rel: "manifest",
  //   href: "/site.webmanifest",
  //   crossOrigin: "use-credentials",
  // } as const, // necessary to make typescript happy
];

export const meta: Route.MetaFunction = ({ data }) => [
  { title: data ? "React Router" : "Error | React Router" },
  { name: "description", content: `Basic React Router Example` },
];

export const headers: Route.HeadersFunction = pipeHeaders;

export async function loader({ request }: Route.LoaderArgs) {
  const { getTheme } = await themeSessionResolver(request);

  const timings = makeTimings("root loader");

  return data(
    {
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      ENV: getEnv(),
      theme: getTheme(),
    },
    {
      headers: combineHeaders({ "Server-Timing": timings.toString() }),
    },
  );
}

function App() {
  const data = useLoaderData<typeof loader | null>();
  const nonce = useNonce();
  const [theme] = useTheme();
  const allowIndexing = ENV.ALLOW_INDEXING !== "false";

  return (
    <html lang="en" className={`${theme ?? ""}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {!allowIndexing && <meta name="robots" content="noindex, nofollow" />}
        <Meta />
        <PreventFlashOnWrongTheme nonce={nonce} ssrTheme={Boolean(theme)} />
        <Links />
      </head>
      <body className="font-sans antialiased">
        <Outlet />
        <Toaster />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function AppWithProviders({ loaderData }: Route.ComponentProps) {
  return (
    <ThemeProvider
      specifiedTheme={loaderData.theme}
      themeAction="/action/set-theme"
      disableTransitionOnThemeChange={true}
    >
      <App />
    </ThemeProvider>
  );
}

// this is a last resort error boundary. There's not much useful information we
// can offer at this level.
export const ErrorBoundary = GeneralErrorBoundary;
