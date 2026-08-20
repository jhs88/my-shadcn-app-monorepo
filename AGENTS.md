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

- `apps/react-router-web` reads the repo root `.env` by default via `apps/react-router-web/index.js`, and that file may point at a remote Supabase instance. Local e2e work that is meant to run against `supabase start` must override the app's Supabase env explicitly instead of trusting the default `.env`.
- pnpm settings such as `packageExtensions` belong in `pnpm-workspace.yaml`; pnpm 10 ignores the legacy root `package.json#pnpm` field.
- The shadcn registry ships each component in multiple base flavors (`radix`, `base`, `aria`), but there is **no** `base` field in `components.json` and no `--base` flag on `shadcn add` (verified against CLI 4.18.0). The flavor is encoded as a prefix of the `style` string (e.g. `base-nova` vs the legacy Radix `new-york`), and `init --base` only affects new projects. Existing configs keep their `style` forever, so an unqualified `shadcn add` here emits legacy Radix variants even after the migration to the base flavor starts. Before pulling components, set `style` to the desired flavor-prefixed value in all three `components.json` files (`packages/ui`, `apps/web`, `apps/react-router-web`) (see `.scratch/shadcn-registry-sync/findings/base-flavor-drift-audit.md`).
