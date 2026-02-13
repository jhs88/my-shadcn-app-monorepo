# @repo/typescript-config - Agent Guide

Shared TypeScript configurations for consistent compiler settings across the monorepo.

## Configurations

- **base.json**: Core config for all projects (ES2022, strict mode, Node.js resolution)
- **nextjs.json**: Next.js specific (JSX, path aliases, App Router support)
- **react-library.json**: UI packages (declaration generation, module system)

## Key Compiler Options

- **Type Checking**: Strict mode, safe array access, precise optional types
- **Module Resolution**: ESNext modules, Node.js strategy, TypeScript imports
- **Code Generation**: Declaration files, source maps, preserve comments
- **Path Mapping**: `@/*` for local, `@repo/*` for shared packages

## Usage Patterns

```json
// Next.js apps
"extends": "@repo/typescript-config/nextjs.json"

// Node.js packages
"extends": "@repo/typescript-config/base.json"

// UI libraries
"extends": "@repo/typescript-config/react-library.json"
```

## Development Guidelines

- Use `nextjs.json` for Next.js applications
- Use `base.json` for Node.js packages
- Use `react-library.json` for UI packages
- Maintain consistent alias patterns (`@/` local, `@repo/` shared)
- Prefer type-only imports: `import type { User }`

## Integration Features

- Project references for large codebases
- Incremental compilation with Turbo caching
- Cross-project type checking
- Enhanced Intellisense and refactoring

## Important Notes

- All projects must extend from base config
- Strict mode is non-negotiable
- Changes affect entire monorepo
- Document custom path aliases