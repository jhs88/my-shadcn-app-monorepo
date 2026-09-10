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
- The current Turbo-based `apps/api/Dockerfile` runs `pnpm i -g turbo` before copying the root `package.json`, so Corepack cannot see the repository's pinned pnpm version. As of 2026-08-12 it selects pnpm 11 on Node 20 and fails on the missing `node:sqlite` built-in. Docker setup steps must activate or expose the repository-pinned package manager before invoking pnpm.
- `apps/java-api/src/main/resources/application.properties` configures the actuator base path as `/actutaor` (misspelled), so the current container health endpoint is `/actutaor/health`, not `/actuator/health`.
- The Java `build` and `test` package scripts both begin with Maven `clean` and write `apps/java-api/target`; task runners must serialize them when both are requested or Maven can fail while deleting the shared output directory.
- `moon docker file <project>` writes to that project's existing `Dockerfile` when no destination is supplied; always pass an explicit prototype destination when comparing against a current Dockerfile.
- With Moon 2.4.6 and this repo's system-toolchain configuration, the default generated Dockerfile starts from `scratch` but still emits shell installation commands and uses the build task as `CMD`; treat it as a structural reference and maintain repo-specific runtime stages.
- Corepack in a Node Docker base may resolve a pnpm version incompatible with that Node version; Dockerfiles must explicitly activate the repository's pnpm version before invoking pnpm.
- Docker build contexts must exclude `.env` files recursively; frontend image builds receive Supabase/public configuration through explicit build arguments instead of copying the repo-root environment file.
- Moon 2.4.6 cannot cache `apps/web`'s complete Next.js standalone output on every runner because the pnpm symlink graph can trigger `task_runner::output::symlink_outside_workspace` after `next build` succeeds. Keep `web:build` non-cacheable rather than caching an incomplete subset of `.next/standalone`.
- Moon Docker scaffolds retain the workspace definition, so an unfiltered `pnpm install` materializes dependencies for every workspace and can exhaust ARC runner disk. In each `Dockerfile.moon`, install with `--filter <project>...` to include only the target and its workspace dependencies.
- React Router v8 prerendering starts a temporary Vite preview server. In the Node 24 container, leaving Vite's preview host implicit caused deterministic `ECONNREFUSED 127.0.0.1:<port>` failures; keep `apps/react-router-web/vite.config.ts#preview.host` pinned to `127.0.0.1` unless the container networking behavior is reverified.
- `AGENTS.md` refers agents to a "Wayfinding operations" section in `docs/agents/issue-tracker.md`, but that section is currently absent. Until it is documented, Wayfinder maps use the local Markdown tracker with explicit parent and `blocked_by` metadata/body links as the fallback relationship convention.
- React Router Playwright tests discover local Supabase credentials through `scripts/lib/supabase-local-env.mjs` and inject them into `react-router dev`. Keep that guarded path intact; local E2E must never fall back to potentially remote values from the repository-root `.env`.
- The shadcn registry ships each component in multiple base flavors (`radix`, `base`, `aria`), but there is **no** `base` field in `components.json` and no `--base` flag on `shadcn add` (verified against CLI 4.18.0). The flavor is encoded as a prefix of the `style` string (e.g. `base-nova` vs the legacy Radix `new-york`), and `init --base` only affects new projects. Existing configs keep their `style` forever, so an unqualified `shadcn add` here emits legacy Radix variants even after the migration to the base flavor starts. Before pulling components, set `style` to the desired flavor-prefixed value in all three `components.json` files (`packages/ui`, `apps/web`, `apps/react-router-web`) (see `.scratch/shadcn-registry-sync/findings/base-flavor-drift-audit.md`).
