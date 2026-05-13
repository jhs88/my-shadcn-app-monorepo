# web — Next.js Frontend

## Overview

**Demo example** showing how to integrate shadcn/ui in a Next.js 16 App Router application. Demonstrates server actions for auth, TanStack Query for server state, and a multi-theme UI system.

## Tech stack

- **Framework**: Next.js 16 (App Router, standalone output)
- **Language**: TypeScript, React 19
- **Auth**: Supabase (email/password + GitHub OAuth)
- **State**: TanStack Query v5 (server state), React hooks (client state)
- **Forms**: react-hook-form + zod validation
- **UI**: @repo/ui (shadcn/ui components), Tailwind CSS, sonner (toasts)
- **Styling**: next-themes for theme switching, 6 bundled themes

## Routing structure

```
app/
├── page.tsx              # Landing page — greeting form calling Express API
├── layout.tsx            # Root layout with providers (QueryClient + theme)
├── loading.tsx           # Global loading state
├── not-found.tsx         # 404 page
├── global-error.tsx      # Error boundary
├── auth/
│   ├── login/page.tsx    # Login form (email/password)
│   ├── sign-up/page.tsx  # Registration form
│   ├── forgot-password/  # Password reset flow
│   ├── update-password/  # Password update form
│   ├── confirm/route.ts  # Email confirmation handler
│   ├── oauth/route.ts    # OAuth callback handler
│   ├── error/page.tsx    # Auth error page
│   └── actions.ts        # Server actions for auth operations
├── protected/
│   ├── layout.tsx        # Protected layout with Navbar
│   ├── page.tsx          # Authenticated dashboard
│   └── error.tsx         # Error boundary for protected routes
└── test/                 # Test/demo pages
    ├── page.tsx
    ├── theme/page.tsx    # Theme testing page
    └── toast/page.tsx    # Toast notification testing
```

## Key patterns

### Server actions (auth)

Auth operations use Next.js server actions in `app/auth/actions.ts`:
- `signup(formData)` — creates Supabase user, redirects to `/protected`
- `login(formData)` — signs in with email/password
- `oauthLogin(origin)` — initiates GitHub OAuth flow
- `logout()` — signs out, redirects to login

All auth actions use `redirect()` for navigation and `revalidatePath("/", "layout")` to refresh the layout.

### TanStack Query

Configured via `app/get-query-client.ts`:
- Server-side: fresh QueryClient per request
- Client-side: singleton browser client (important for Suspense)
- 60s default staleTime for SSR compatibility
- Pending queries included in dehydration
- Error redaction disabled (Next.js handles this)

Wrapped in `Providers` component alongside theme provider.

### Theme system

Located in `components/themes/`:
- `ActiveThemeProvider` — context-based theme state
- `theme.config.tsx` — theme definitions
- `theme-selector.tsx` — UI for switching themes
- `theme-mode-toggle.tsx` — light/dark mode toggle
- `fonts.config.tsx` — font configuration

Themes are styled via CSS variables in `@repo/ui/src/styles/themes/`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_HOST` | Express API endpoint (default: `http://localhost:3001`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

## Dependencies on other packages

- `@repo/ui` — all UI components (transpiled via Next.js)
- `@repo/types` — Supabase database types
- `@repo/eslint-config` — linting rules (next preset)

## Glossary

| Term | Definition |
| --- | --- |
| **Protected route** | Any route under `/protected/` that requires authentication |
| **Theme** | A visual style defined by CSS variables (e.g., "supabase", "vercel", "neobrutalism") |
| **Server action** | A Next.js server-side function called from client components for mutations |
