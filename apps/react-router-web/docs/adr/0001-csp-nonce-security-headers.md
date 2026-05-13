# ADR-0001: CSP nonce for security headers

**Status**: Accepted  
**Context**: React Router SSR app needs Content Security Policy that allows inline scripts/styles while remaining secure

## Decision

Use per-request cryptographic nonces injected into CSP headers:
- `app/utils/nonce-provider.ts` generates a unique nonce per request via React context
- `app/utils/headers.server.ts` builds security headers with the nonce embedded in `script-src` and `style-src` directives
- Inline scripts/styles include the nonce attribute to pass CSP validation

## Rationale
- Strict CSP without nonces blocks all inline scripts, which many UI libraries depend on
- Nonces provide a middle ground: only explicitly allowed inline content executes
- Helmet (`@nichtsam/helmet`) handles header construction with nonce support

## Consequences
- Every request generates a new nonce — no caching of headers across requests
- All inline `<script>` and `<style>` tags must include the nonce attribute
- SSR rendering must have access to the nonce (passed through React context)
