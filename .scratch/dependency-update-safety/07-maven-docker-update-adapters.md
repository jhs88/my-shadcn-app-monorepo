---
title: "Add Maven and Docker dependency update adapters"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Extend update discovery to the real Maven and Docker seams while retaining one root npm workspace adapter.

## Depends on

- `05-reusable-container-build-gate.md`
- `06-pnpm-compatibility-catalogs.md`

## Scope

- Preserve existing root npm and GitHub Actions update adapters.
- Add a Maven adapter for the Spring Boot Item example.
- Add Docker adapters for all four application image definitions.
- Group updates by ecosystem and use labels that make update ownership clear.
- Revisit cadence and open-pull-request limits so the workspace does not starve update lanes.

## Acceptance criteria

- [ ] Maven dependency updates are discovered for the Spring Boot example.
- [ ] Node and Eclipse Temurin base-image updates are discovered for every applicable image.
- [ ] Root npm workspace discovery remains singular and functional.
- [ ] Test update pull requests pass the same required verification and image checks as human changes.
- [ ] Major updates remain review-required and are not auto-merged.
- [ ] The configured cadence and pull-request limits permit at least one active update per supported ecosystem.
- [ ] Update configuration syntax is validated.

## Out of scope

- Terraform, Supabase CLI, OS-package, or Maven distribution automation.
- Replacing Dependabot with another updater.
