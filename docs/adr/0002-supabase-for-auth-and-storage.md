# ADR-0002: Supabase for authentication and storage

**Status**: Accepted  
**Date**: 2025-01-XX  
**Context**: Both web frontends need user authentication, profiles, and avatar storage

## Decision

Use Supabase as the authentication backend, providing:
- Email/password sign-up and login
- GitHub OAuth provider
- Magic link / password reset flows
- User profiles table with RLS policies
- Avatar storage bucket
- Custom access token hook to filter JWT claims

## Consequences

### Positive
- Auth is shared between both frontends (Next.js and React Router) via the same Supabase project
- Row Level Security (RLS) on `profiles` table ensures users can only read/write their own data
- TypeScript types auto-generated from DB schema (`packages/types/database.types.ts`)
- Supabase Edge Functions available for serverless logic

### Negative
- Auth state management differs between frameworks: Next.js uses cookies + `@supabase/ssr`, React Router uses a similar pattern but with different cookie handling
- The custom access token hook filters JWT claims to a whitelist — any new claim needs migration
- Supabase-specific patterns (RLS policies, storage buckets) add coupling

## Database schema (Supabase)

```sql
profiles (
  id uuid references auth.users,
  username text unique (min 3 chars),
  avatar_url text,
  website text,
  updated_at timestamp
)
```

Storage bucket: `avatars` — publicly readable, anyone can upload/update.

## Related
- ADR-0005: Multi-frontend strategy
