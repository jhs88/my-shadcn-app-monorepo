# ADR-0002: Sentry for error monitoring

**Status**: Accepted  
**Context**: Production error tracking and performance monitoring needed

## Decision

Use Sentry with two integrations:
- `@sentry/react-router` — client-side error capture and React Router navigation tracking
- `@sentry/profiling-node` — server-side profiling for SSR performance

## Rationale
- Provides unified error tracking across client and server
- React Router integration captures route-level errors automatically
- Node profiling identifies slow SSR rendering paths

## Consequences
- Sentry DSN must be configured as an environment variable
- Profiling adds overhead in production (disabled in dev via environment)
- Error messages are sent externally — consider data privacy for sensitive applications
