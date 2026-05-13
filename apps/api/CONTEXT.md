# api — Express.js Server

## Overview

**Demo example** of a minimal Express.js REST API with TypeScript. Demonstrates `esbuild-register` for running TypeScript at runtime without pre-compilation, and Jest + supertest for HTTP testing.

## Tech stack

- **Framework**: Express 4
- **Language**: TypeScript (compiled via esbuild at runtime)
- **Testing**: Jest with supertest for HTTP testing
- **Logging**: Morgan (dev format)
- **Middleware**: body-parser (json + urlencoded), cors

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/message/:name` | Returns `{ message: "hello <name>" }` |
| GET | `/status` | Health check — returns `{ ok: true }` |

## Architecture

Single `createServer()` factory in `src/server.ts`:
- Creates Express app
- Disables `x-powered-by` header
- Applies middleware (morgan, body-parser, cors)
- Registers routes inline
- Returns the app instance

`src/index.ts` calls `createServer()` and starts listening.

## Development vs production

| Aspect | Development | Production |
| --- | --- | --- |
| Execution | `nodemon` + `esbuild-register` (hot reload) | `node -r esbuild-register` |
| Build | `tsc` (type checking only, no emit needed for runtime) | Same — runtime uses esbuild-register |

## Testing

- Jest with `@repo/jest-presets/node` preset
- supertest for HTTP request testing
- Test file: `src/__tests__/server.test.ts`

## Glossary

| Term | Definition |
| --- | --- |
| **esbuild-register** | Allows running TypeScript directly without pre-compilation — used both in dev and prod |
