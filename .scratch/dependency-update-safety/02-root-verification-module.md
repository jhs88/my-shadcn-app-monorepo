---
title: "Establish the repository verification module"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Create one deep repository verification module with the external interface `pnpm verify`. Turbo orchestration and native workspace tooling remain implementation details behind this seam.

## Depends on

- `01-deterministic-task-adapters.md`

## Scope

- Add a deterministic root verification interface covering lint, type checks, tests, and production builds.
- Preserve the existing individual root task interfaces.
- Ensure failures identify the owning workspace and stage.
- Document the verifier as the local pre-pull-request and package-update check.

## Acceptance criteria

- [ ] `pnpm verify` exits zero only when all participating lint, type, test, and build tasks pass.
- [ ] The verifier reaches both frontends, Express, Spring Boot, and applicable shared packages.
- [ ] The verifier is non-interactive and independent of production secrets or remote-cache availability.
- [ ] A failing lint, type, test, Maven verification, or production build task produces a non-zero result.
- [ ] A clean checkout passes frozen installation followed by verification.
- [ ] Turbo summary or dry-run output demonstrates that shared-package changes invalidate dependent tasks.

## Out of scope

- Docker image builds inside the local verifier.
- Requiring tests in packages with no existing test behavior.
- Knip or unused-export analysis.

## Closing notes

Implemented on `feat/dependency-update-safety`. `pnpm verify` runs lint, type checks, tests, and builds as deterministic sequential phases. Generated Next.js output is excluded from lint, warning baselines are budgeted, React Router type-checking follows only imported shared UI modules, and the complete verifier passes.
