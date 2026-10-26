import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { NonceProvider } from "./utils/nonce-provider";

const nonce =
  document.querySelector<HTMLScriptElement>("script[nonce]")?.nonce ?? "";

if (ENV.MODE === "production" && ENV.SENTRY_DSN) {
  void import("./utils/monitoring.client").then(({ init }) => init());
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <NonceProvider value={nonce}>
        <HydratedRouter />
      </NonceProvider>
    </StrictMode>,
  );
});
