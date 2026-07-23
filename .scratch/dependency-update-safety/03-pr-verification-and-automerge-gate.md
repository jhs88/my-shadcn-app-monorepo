---
title: "Require verification before release and auto-merge"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Make pull requests and dependency automation cross the same repository verification seam before Changesets processing or merge eligibility.

## Depends on

- `02-root-verification-module.md`

## Scope

- Run frozen installation and the repository verifier in the existing release workflow before Changesets behavior.
- Give the verification job a stable check name suitable for branch protection.
- Ensure Dependabot auto-merge waits for required checks on the final commit.
- Preserve existing eligible release behavior after verification succeeds.

## Acceptance criteria

- [ ] Every pull request to the default branch runs frozen installation and repository verification.
- [ ] A verification failure prevents Changesets processing and merge eligibility.
- [ ] Pull requests never publish packages.
- [ ] Non-major Dependabot updates may enable auto-merge only after all required checks pass on the final commit.
- [ ] Major updates never auto-merge.
- [ ] Missing, skipped, cancelled, or stale verification results block auto-merge.
- [ ] Maintainer documentation identifies the stable check name that must be required in repository settings.

## Out of scope

- Replacing Changesets or Dependabot.
- Programmatically changing branch-protection settings.
- Package version updates.
