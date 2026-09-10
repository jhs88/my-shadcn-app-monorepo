# react-router-web — React Router Frontend

## Overview

**Demo example** showing how to integrate shadcn/ui in a React Router v7 application with SSR. Demonstrates loaders/actions for data loading, CSP nonce security headers, Sentry monitoring, and Supabase auth — using React Router's idiomatic patterns.

## Tech stack

- **Framework**: React Router framework mode (fs-routes and SSR)
- **Language**: TypeScript, React 19
- **Auth**: Supabase (email/password + GitHub OAuth)
- **Data loading**: React Router loaders (server-side fetch)
- **Monitoring**: Sentry React Router integration with browser profiling and replay
- **UI**: @repo/ui (shadcn/ui components), Tailwind CSS, sonner (toasts)
- **Server**: React Router's development server locally and `react-router-serve` in production
- **Security**: Helmet content APIs with per-request CSP nonces during SSR

## Routing structure (file-based via fs-routes)

```
app/routes/
├── _index.tsx              # Home page
├── $.tsx                   # Catch-all (404)
├── login.tsx               # Login form
├── sign-up.tsx             # Registration form
├── forgot-password.tsx     # Password reset
├── update-password.tsx     # Password update
├── logout.tsx              # Logout handler
├── protected.tsx           # Authenticated page
├── auth.confirm.tsx        # Email confirmation
├── auth.error.tsx          # Auth error display
├── auth.oauth.tsx          # OAuth callback
├── action.set-theme.ts     # Theme switching action
├── items._index.tsx        # Item list (fetches from Java API)
├── items.$id.tsx           # Single item view
├── instruments._index.tsx  # Instrument list (fetches from Supabase)
├── resources.healthcheck.ts # Health check endpoint
├── test.tsx                # Test page
└── test-theme.tsx          # Theme testing page
```

## Key patterns

### Loaders

Data is fetched server-side via React Router loaders:
- `items._index.tsx` — fetches from Java API (`JAVA_API_HOST/items`)
- `instruments._index.tsx` — fetches from Supabase (`supabase.from("instruments").select()`)

Loaders run on the server, so they have access to cookies and server-side Supabase client.

### Auth workflow module

Auth mutations use route actions as thin framework adapters around `app/auth/workflows/`:
- `server.ts` — creates the Supabase adapter and preserves response headers
- `operations.ts` — owns validation, auth orchestration, and result shaping
- `types.ts` / `validation.ts` — define the auth workflow interface and invariants

Routes such as `login.tsx`, `sign-up.tsx`, `forgot-password.tsx`, `update-password.tsx`, and `logout.tsx` translate `FormData` and redirects around the auth workflow module instead of owning the auth rules directly.

### Supabase integration

Two clients in `app/lib/supabase/`:
- `server.ts` — server-side client with cookie-based auth (used in loaders)
- `client.ts` — browser-side client (used in client components)

### Security headers

Configured via `@nichtsam/helmet` with CSP nonce support:
- `app/utils/nonce-provider.ts` — generates per-request nonces for inline scripts/styles
- `app/utils/headers.server.ts` — builds security headers with nonce injection

### Monitoring

Sentry integration:
- `app/utils/monitoring.client.tsx` — client-side Sentry initialization
- `@sentry/react-router` — React Router error tracking, browser profiling, and replay
- `vite.config.ts` and `react-router.config.ts` — production source-map upload hooks

### Canonical server runtime

Use `react-router dev` for local development and `react-router-serve` with the
built server bundle for production. The Docker image and the package `start`
script use the same production server path.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `JAVA_API_HOST` | Java API endpoint (default: `http://localhost:8080`) |
| `SUPABASE_URL` | Supabase project URL (server-side) |
| `SUPABASE_ANON_KEY` | Supabase anon key (server-side) |
| `VITE_SUPABASE_URL` | Supabase project URL (client-side, Vite-exposed) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (client-side, Vite-exposed) |

## Dependencies on other packages

- `@repo/ui` — all UI components
- `@repo/types` — Supabase database types

## Glossary

| Term | Definition |
| --- | --- |
| **Loader** | A React Router function that fetches data server-side before rendering a route |
| **Nonce** | A per-request cryptographic token injected into CSP headers to allow specific inline scripts |
| **Action route** | A file prefixed with `action.` that handles form submissions and mutations |
| **Auth workflow** | The local module in `app/auth/workflows/` that owns auth validation, Supabase orchestration, and typed auth results |
| **Framework adapter** | A route action or form that translates React Router request/response details around the auth workflow |
