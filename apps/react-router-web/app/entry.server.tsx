import crypto from "node:crypto";
import { PassThrough } from "node:stream";
import { styleText } from "node:util";

import { contentSecurity } from "@nichtsam/helmet/content";
import { createReadableStreamFromReadable } from "@react-router/node";
import * as Sentry from "@sentry/react-router";
import { isbot } from "isbot";
import {
  renderToPipeableStream,
  type RenderToPipeableStreamOptions,
} from "react-dom/server";
import {
  type ActionFunctionArgs,
  type AppLoadContext,
  type EntryContext,
  type HandleDocumentRequestFunction,
  type LoaderFunctionArgs,
  ServerRouter,
} from "react-router";
import { getEnv, init } from "./utils/env.server";
import { NonceProvider } from "./utils/nonce-provider";
import { makeTimings } from "./utils/timing.server";

export const streamTimeout = 5000;

init();
global.ENV = getEnv();

const MODE = process.env.NODE_ENV ?? "development";

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext,
) {
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN)
    responseHeaders.append("Document-Policy", "js-profiling");

  const nonce = crypto.randomBytes(16).toString("hex");

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");

    // NOTE: this timing will only include things that are rendered in the shell
    // and will not include suspended components and deferred loaders
    const timings = makeTimings("render", "renderToPipeableStream");

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    let readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || routerContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <NonceProvider value={nonce}>
        <ServerRouter nonce={nonce} context={routerContext} url={request.url} />
      </NonceProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");
          responseHeaders.append("Server-Timing", timings.toString());

          contentSecurity(responseHeaders, {
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
              // NOTE: Remove reportOnly when you're ready to enforce this CSP
              reportOnly: true,
              directives: {
                fetch: {
                  "connect-src": [
                    MODE === "development" ? "ws:" : undefined,
                    process.env.SENTRY_DSN ? "*.sentry.io" : undefined,
                    process.env.SUPABASE_URL ?? (MODE !== "production" ? "http://localhost:54321" : undefined),
                    "'self'",
                  ],
                  "font-src": ["'self'", "fonts.gstatic.com"],
                  "frame-src": ["'self'"],
                  "img-src": ["'self'", "data:"],
                  "script-src": [
                    "'strict-dynamic'",
                    "'self'",
                    `'nonce-${nonce}'`,
                  ],
                  "script-src-attr": [`'nonce-${nonce}'`],
                },
              },
            },
          });

          resolve(
            new Response(createReadableStreamFromReadable(body), {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
        nonce,
      },
    );

    // Abort the rendering stream after the `streamTimeout` so it has time to
    // flush down the rejected boundaries
    setTimeout(abort, streamTimeout + 1000);
  });
}

export function handleError(
  error: unknown,
  { request }: LoaderFunctionArgs | ActionFunctionArgs,
): void {
  // Skip capturing if the request is aborted as Remix docs suggest
  // Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
  if (request.signal.aborted) return;

  if (error instanceof Error) {
    console.error(styleText("red", String(error.stack)));
  } else {
    console.error(error);
  }

  Sentry.captureException(error);
}
