# ADR-0003: shadcn/ui as shared component library

**Status**: Accepted  
**Date**: 2025-01-XX  
**Context**: Two React frontends need consistent UI with theming support

## Decision

Use shadcn/ui components packaged in `@repo/ui` as a shared workspace package:
- Components are sourced from shadcn/ui (Radix UI primitives + Tailwind CSS)
- Published as a pnpm workspace package — imported via `@repo/ui/components/*`
- Next.js transpiles the package (`transpilePackages: ["@repo/ui"]`)
- 6 themes supported via CSS variables in `src/styles/themes/`

## Themes

| Theme | Style inspiration |
| --- | --- |
| supabase | Supabase brand colors |
| vercel | Vercel dark/light aesthetic |
| neobrutalism | High contrast, bold borders |
| notebook | Clean, paper-like appearance |
| claude | Claude AI branding |
| mono | Minimal monochrome |

## Consequences

### Positive
- Both web apps share the same component implementations — no UI drift
- Theme switching is runtime (CSS variable swap) with no rebuild needed
- shadcn/ui components are MIT-licensed source code — fully customizable
- Data table components built on @tanstack/react-table with faceted filters, date filters, slider filters

### Negative
- Adding a new component requires running `shadcn@latest add` in the workspace
- Next.js must transpile the package to resolve Tailwind classes correctly
- React Router app may need similar configuration for CSS handling
- Custom components (e.g., `item.tsx`, `data-table/*.tsx`) are mixed with shadcn primitives in the same package

## Related
- ADR-0005: Multi-frontend strategy
