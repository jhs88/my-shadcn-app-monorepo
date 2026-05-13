# ADR-0001: Server actions for authentication

**Status**: Accepted  
**Context**: Next.js app needs auth mutations (login, signup, logout)

## Decision

Use Next.js server actions in `app/auth/actions.ts` for all authentication operations instead of API routes.

## Rationale
- Server actions eliminate the need for separate `/api/auth/*` endpoints
- Direct `redirect()` and `revalidatePath()` calls simplify navigation after auth changes
- Form data flows directly from client to server without manual fetch

## Consequences
- Auth logic is tightly coupled to Next.js (not portable)
- Testing requires Next.js test utilities or integration tests against the full app
