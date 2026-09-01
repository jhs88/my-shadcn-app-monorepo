# Context Map

This is a **demo/template monorepo** showcasing shadcn/ui integration across multiple React SSR frameworks and backend technologies. Each app is an independent example demonstrating idiomatic patterns for its stack.

## App contexts

| Context | Path | Description |
| --- | --- | --- |
| **web** | [`apps/web/CONTEXT.md`](apps/web/CONTEXT.md) | Next.js 16 example — demonstrates server actions, TanStack Query, theme system |
| **react-router-web** | [`apps/react-router-web/CONTEXT.md`](apps/react-router-web/CONTEXT.md) | React Router framework-mode SSR example — demonstrates loaders/actions, middleware, CSP nonce security, Sentry monitoring |
| **api** | [`apps/api/CONTEXT.md`](apps/api/CONTEXT.md) | Express.js example — minimal REST API demonstrating esbuild-register TypeScript runtime |
| **java-api** | [`apps/java-api/CONTEXT.md`](apps/java-api/CONTEXT.md) | Spring Boot 3 example — Item CRUD with JPA/H2, comprehensive test hierarchy patterns |

## Shared packages

| Package | Path | Description |
| --- | --- | --- |
| **@repo/ui** | `packages/ui` | shadcn/ui component library — shared across both web apps, includes theme system (6 themes), data table components |
| **@repo/logger** | `packages/logger` | Isomorphic logger wrapper around `console.log` |
| **@repo/types** | `packages/types` | Supabase-generated TypeScript types (`database.types.ts`) |
| **@repo/eslint-config** | `packages/eslint-config` | ESLint presets — base, next, react-internal |
| **@repo/typescript-config** | `packages/typescript-config` | Shared tsconfig.json base configurations |
| **@repo/jest-presets** | `packages/jest-presets` | Jest configuration presets for Node.js projects |

## System-wide decisions

See [`docs/adr/`](docs/adr/) for architectural decision records that apply to the entire monorepo.
