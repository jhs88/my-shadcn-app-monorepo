---
title: "Update the React 19 compatibility cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update React, React DOM, and their type declarations together to the latest mutually compatible React 19 releases.

## Depends on

- `05-reusable-container-build-gate.md`
- `06-pnpm-compatibility-catalogs.md`
- `07-maven-docker-update-adapters.md`

## Scope

- Update React 19 and React DOM 19 as one cohort.
- Align React type declarations, shared UI peer constraints, and overrides with the selected release.
- Limit lockfile changes to this compatibility cohort and unavoidable transitive resolution changes.

## Acceptance criteria

- [ ] Every direct React and React DOM declaration remains on major 19 and resolves compatibly.
- [ ] React type declarations remain compatible with the runtime release.
- [ ] Shared UI peer constraints and overrides truthfully describe supported React versions.
- [ ] Frozen installation, repository verification, and all image builds pass.
- [ ] No React next-major or unrelated package migration is introduced.
- [ ] Selected versions are recorded in the pull-request description.

## Out of scope

- A future React major migration.
- Shared shadcn source refactoring.
- UI behavior redesign.

## Closing notes

Updated React and React DOM to 19.2.8, constrained shared React and React type ranges to the 19.2 line, regenerated the lockfile, and verified both frontend builds plus the full repository verifier.
