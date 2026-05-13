# ADR-0002: TanStack Query for server state

**Status**: Accepted  
**Context**: Need client-side caching and server state management

## Decision

Use TanStack Query v5 as the server state layer, configured with:
- Server-side singleton per request (fresh client)
- Browser-side singleton (persists across renders for Suspense compatibility)
- 60s default staleTime for SSR
- Pending query dehydration

## Rationale
- React hooks alone don't provide caching, deduplication, or background refetching
- TanStack Query integrates well with Next.js App Router's server/client model
- Dehydration allows prefetching queries on the server and hydrating them on the client

## Consequences
- `Providers` component must wrap the app without `useState` for QueryClient (Suspense safety)
- Error redaction is disabled because Next.js uses errors for dynamic page detection
