---
title: "Encode package compatibility cohorts with pnpm catalogs"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Centralize repeated compatibility knowledge in pnpm catalogs so related packages move atomically without coupling the independent application implementations.

## Depends on

- `03-pr-verification-and-automerge-gate.md`

## Scope

- Identify repeated runtime and tooling cohorts across workspace manifests.
- Introduce named catalogs for React, React Router v7, Next.js tooling, ESLint 9, TypeScript 5, and test-runner families where repetition provides leverage.
- Keep independently evolving Supabase frontend cohorts separate.
- Configure npm update groups to mirror catalog cohorts where supported.
- Preserve workspace protocol declarations for internal packages.

## Acceptance criteria

- [ ] Repeated compatible versions are declared once per intentional cohort.
- [ ] All six direct React Router packages resolve through one v7 cohort.
- [ ] React and React DOM runtime and type constraints remain compatible across consumers and peers.
- [ ] Independent frontend implementations remain independent.
- [ ] Frozen installation produces a consistent lockfile.
- [ ] A test dependency update proves the updater changes the cohort coherently and includes the lockfile.
- [ ] Repository verification and all image builds pass.

## Out of scope

- Updating package versions beyond changes required to introduce catalogs.
- Combining the frontend examples.
- Replacing Dependabot.
