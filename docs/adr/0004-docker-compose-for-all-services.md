# ADR-0004: Docker Compose for all services

**Status**: Accepted  
**Date**: 2025-01-XX  
**Context**: Four services (web, react-router-web, api, java-api) need to run together in production

## Decision

Use Docker Compose to orchestrate all four services on a shared network:
- Each app has its own Dockerfile using multi-stage builds with Turborepo
- Services communicate via container names as hostnames on `app_network`
- Turborepo remote caching supported via build args (`TURBO_TEAM`, `TURBO_TOKEN`)

## Service ports

| Service | Container port | Host port | Notes |
| --- | --- | --- | --- |
| web (Next.js) | 3000 | 3000 | Primary frontend |
| api (Express) | 3001 | 3001 | REST API |
| react-router-web | 3000 | 8080 | Alternative frontend |
| java-api (Spring Boot) | 8080 | 8081 | Item CRUD API |

## Consequences

### Positive
- Single `docker-compose up` starts the entire stack
- Turborepo BuildKit integration provides layer caching across builds
- Next.js standalone output produces minimal Docker images

### Negative
- Build context is the monorepo root — all Dockerfiles share the same context
- Java API build runs inside Docker via Maven (slower than native Maven builds)
- Environment variables must be passed consistently between docker-compose and Turborepo
- Secrets management relies on environment variables, not Docker secrets in practice

## Related
- ADR-0001: pnpm monorepo with Turborepo
