# AGENTS.md

This file configures how agent skills interact with this repository.

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AGENTS.md file to help prevent future agents from having the same issues.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/<feature>/`, with optional publishing to GitHub Issues when needed. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context monorepo — `CONTEXT-MAP.md` at root points to per-app `CONTEXT.md` files. See `docs/agents/domain.md`.

## Surprises / Confusion Points

- pnpm settings such as `packageExtensions` belong in `pnpm-workspace.yaml`; pnpm 10 ignores the legacy root `package.json#pnpm` field.
- React Router v8 prerendering starts a temporary Vite preview server. In the Node 24 container, leaving Vite's preview host implicit caused deterministic `ECONNREFUSED 127.0.0.1:<port>` failures; keep `apps/react-router-web/vite.config.ts#preview.host` pinned to `127.0.0.1` unless the container networking behavior is reverified.
- `AGENTS.md` refers agents to a "Wayfinding operations" section in `docs/agents/issue-tracker.md`, but that section is currently absent. Until it is documented, Wayfinder maps use the local Markdown tracker with explicit parent and `blocked_by` metadata/body links as the fallback relationship convention.
- React Router Playwright tests discover local Supabase credentials through `scripts/lib/supabase-local-env.mjs` and inject them into `react-router dev`. Keep that guarded path intact; local E2E must never fall back to potentially remote values from the repository-root `.env`.
- The shadcn registry ships each component in multiple base flavors (`radix`, `base`, `aria`), but there is **no** `base` field in `components.json` and no `--base` flag on `shadcn add` (verified against CLI 4.18.0). The flavor is encoded as a prefix of the `style` string (e.g. `base-nova` vs the legacy Radix `new-york`), and `init --base` only affects new projects. Existing configs keep their `style` forever, so an unqualified `shadcn add` here emits legacy Radix variants even after the migration to the base flavor starts. Before pulling components, set `style` to the desired flavor-prefixed value in all three `components.json` files (`packages/ui`, `apps/web`, `apps/react-router-web`) (see `.scratch/shadcn-registry-sync/findings/base-flavor-drift-audit.md`).
