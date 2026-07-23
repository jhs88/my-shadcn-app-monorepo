---
title: "Update the React Router Vitest 3 cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the React Router example’s isolated Vitest dependency within major 3, leaving a future Vitest 4 migration explicit and reviewable.

## Depends on

- `01-deterministic-task-adapters.md`
- `06-pnpm-compatibility-catalogs.md`

## Scope

- Update only the React Router example’s Vitest 3 line to the latest compatible v3 release.
- Validate compatibility with the current Vite and React Router v7 cohorts.

## Acceptance criteria

- [ ] The React Router test task passes on the selected Vitest 3 release.
- [ ] Its existing header/security behavior remains covered.
- [ ] Frozen installation, repository verification, and the React Router image build pass.
- [ ] No Vitest 4, Vite major, or React Router major migration is introduced.

## Out of scope

- Vitest 3 to 4 migration.
- Vite 8 or React Router 8.
- Test-suite expansion unrelated to update compatibility.

## Closing notes

Updated the React Router test runner and its optional UI peer to the exact 3.2.7 cohort. The lockfile has no mixed Vitest 3/UI 4 peer context; Router tests and full verification pass.
