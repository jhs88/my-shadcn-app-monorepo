# ADR-0001: pnpm monorepo with Turborepo

**Status**: Accepted  
**Date**: 2025-01-XX (initial template setup)  
**Context**: Multi-app project requiring shared code between frontend apps and backend services

## Decision

Use pnpm workspaces + Turborepo as the monorepo tooling:
- **pnpm** for package management (workspace protocol for internal deps, strict node_modules)
- **Turborepo** for task orchestration (build, dev, test, lint with caching and parallelism)

## Consequences

### Positive
- Shared packages (`@repo/ui`, `@repo/types`, etc.) are versioned via workspace protocol — no publish step needed
- Turborepo caches build outputs across runs and supports remote caching via Vercel
- Single `pnpm dev` starts all apps in parallel with persistent dev servers
- Type-safe cross-package imports with consistent TypeScript/ESLint config

### Negative
- Java API (`java-api`) is a Maven project embedded in the pnpm workspace — its build is orchestrated by turbo but uses Maven internally
- Turborepo task graph must be configured correctly to handle non-JS builds (Java uses `./mvnw`)
- Developers need both Node.js ≥20 and Java ≥21 installed

## Related
- ADR-0004: Docker Compose for all services
