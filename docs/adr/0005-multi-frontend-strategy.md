# ADR-0005: Dual frontend as demo examples

**Status**: Accepted  
**Date**: 2025-01-XX  
**Context**: This is a demo/template project showcasing how to use shadcn/ui in different React SSR frameworks

## Decision

Include two web frontends as **demonstration examples**, not as production counterparts:
- **`web`** — Next.js 16 (App Router) example
- **`react-router-web`** — React Router v7 (SSR + Express adapter) example

Both share:
- `@repo/ui` component library
- Supabase authentication
- Theme system
- TypeScript/ESLint tooling

## Rationale

This monorepo is a template that demonstrates shadcn/ui integration across different React SSR frameworks. Each frontend shows how the same UI components, auth flows, and theming work in its framework's idiomatic patterns:

- Next.js example demonstrates server actions, App Router conventions, TanStack Query, and Vercel deployment
- React Router example demonstrates loaders/actions, CSP nonce security, Sentry monitoring, and Express adapter

## Consequences

### Positive
- Developers can see the same features implemented in two different frameworks side by side
- Each frontend uses its own idiomatic patterns rather than forcing one framework's conventions onto the other
- The shared `@repo/ui` package proves component portability across frameworks

### Negative
- Feature parity is not required — each example demonstrates what matters for its framework
- Auth flows differ intentionally (server actions vs. loader/action pattern) to show each framework's approach
- Some code duplication exists (e.g., login forms in both apps) — this is expected since they're independent examples

## Related
- ADR-0002: Supabase for authentication and storage
- ADR-0003: shadcn/ui as shared component library
