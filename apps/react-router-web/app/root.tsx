import type { LinksFunction } from "react-router";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { GeneralErrorBoundary } from "~/components/error-boundary";
// import { getEnv } from "~/utils/env.server";
import { pipeHeaders } from "~/utils/headers.server";
import { combineHeaders, getDomainUrl } from "~/utils/misc";
import { useNonce } from "~/utils/nonce-provider";
import { makeTimings } from "~/utils/timing.server";
import type { Route } from "./+types/root";

import "@repo/ui/globals.css";

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
];

export const meta: Route.MetaFunction = ({ data }) => {
  return [
    { title: data ? "React Router" : "Error | React Router" },
    { name: "description", content: `Basic React Router Example` },
  ];
};

export const headers: Route.HeadersFunction = pipeHeaders;

export async function loader({ request }: Route.LoaderArgs) {
  const timings = makeTimings("root loader");
  return data(
    {
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
      // ENV: getEnv(),
    },
    {
      headers: combineHeaders({ "Server-Timing": timings.toString() }),
    },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  // if there was an error running the loader, data could be missing
  // const data = useLoaderData<typeof loader | null>();
  const nonce = useNonce();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* {allowIndexing ? null : (
          <meta name="robots" content="noindex, nofollow" />
        )} */}
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        /> */}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function App(_: Route.ComponentProps) {
  return <Outlet />;
}

// this is a last resort error boundary. There's not much useful information we
// can offer at this level.
export const ErrorBoundary = GeneralErrorBoundary;
