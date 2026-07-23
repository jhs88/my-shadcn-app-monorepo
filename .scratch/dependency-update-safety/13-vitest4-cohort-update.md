---
title: "Update the Vitest 4 tooling cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the root and Next.js Vitest 4 runtime, UI, and coverage packages as one exact compatibility cohort.

## Depends on

- `01-deterministic-task-adapters.md`
- `06-pnpm-compatibility-catalogs.md`

## Scope

- Update Vitest within major 4.
- Move Vitest UI and V8 coverage packages with the runtime release.
- Keep exact-version relationships where required by the test tooling.

## Acceptance criteria

- [ ] Vitest, its UI package, and V8 coverage adapter resolve to compatible v4 releases.
- [ ] The Next.js deterministic test task passes.
- [ ] Coverage execution starts and completes without version mismatch errors.
- [ ] Frozen installation, repository verification, and relevant image builds pass.
- [ ] No Vitest 5 or React Router Vitest migration is included.

## Out of scope

- Vitest 5.
- React Router’s separate Vitest 3 line.
- New coverage thresholds.

## Closing notes

Updated root and Next.js Vitest, UI, and V8 coverage packages to the exact 4.1.10 cohort. Tests, coverage execution, frozen install, builds, and full verification pass.
