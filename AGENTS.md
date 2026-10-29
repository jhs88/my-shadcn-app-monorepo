# AGENTS.md

This file configures how agent skills interact with this repository.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/<feature>/`, with optional publishing to GitHub Issues when needed. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context monorepo — `CONTEXT-MAP.md` at root points to per-app `CONTEXT.md` files. See `docs/agents/domain.md`.

## Surprises / Confusion Points

- pnpm 12 can skip `prepare` when dependencies are already up to date, even after adding the script. If local Git hooks are missing, run `pnpm prepare` and verify `git config --get core.hooksPath` is `.husky/_`. Keep the installer guard in `package.json` self-contained because Moon Docker installs run before source files are copied.
