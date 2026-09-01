# ADR-0002: Sentry for error monitoring

**Status**: Accepted  
**Context**: Production error tracking and performance monitoring needed

## Decision

Use `@sentry/react-router` for client-side error capture, React Router
navigation tracking, browser profiling, and session replay. Production build
hooks upload source maps when Sentry credentials are configured.

## Rationale
- React Router integration captures route-level errors automatically
- Browser profiling identifies slow client-side interactions
- Session replay provides context for client-side failures

## Consequences
- Sentry DSN must be configured as an environment variable
- Browser profiling and replay add overhead and must be sampled appropriately
- Error messages are sent externally — consider data privacy for sensitive applications
