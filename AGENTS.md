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
- The current Turbo-based `apps/api/Dockerfile` runs `pnpm i -g turbo` before copying the root `package.json`, so Corepack cannot see the repository's pinned pnpm version. As of 2026-08-12 it selects pnpm 11 on Node 20 and fails on the missing `node:sqlite` built-in. Docker setup steps must activate or expose the repository-pinned package manager before invoking pnpm.
