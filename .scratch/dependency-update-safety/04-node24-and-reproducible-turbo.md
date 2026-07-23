---
title: "Normalize Node 24 and reproducible Turbo image builds"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Make Node 24 the truthful repository runtime contract and remove mutable global Turbo installations from image builds.

## Depends on

- `03-pr-verification-and-automerge-gate.md`

## Scope

- Standardize Node 24 across workspace runtime declarations, CI, development documentation, Node type declarations, and all Node image stages.
- Keep Java on Java 21.
- Replace global Turbo installation in image builds with the lockfile-resolved repository implementation.
- Require frozen installs before pruning or building images.

## Acceptance criteria

- [ ] Node 24 is the only supported Node major declared and documented for the workspace.
- [ ] CI verification runs on Node 24.
- [ ] Every Node image stage uses Node 24.
- [ ] Direct Node type declarations are aligned with the supported runtime unless a documented compatibility reason exists.
- [ ] No Dockerfile installs Turbo globally.
- [ ] Image pruning invokes the Turbo implementation resolved by the lockfile.
- [ ] Image builds fail when manifests and lockfile disagree.
- [ ] Repository verification and all four image builds pass on Node 24.

## Out of scope

- A future Node major migration.
- Java 21 changes.
- Compose topology or deployment changes.
