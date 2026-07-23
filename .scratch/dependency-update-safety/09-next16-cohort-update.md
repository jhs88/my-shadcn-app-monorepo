---
title: "Update the Next.js 16 compatibility cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the Next.js example and directly coupled lint tooling to the latest compatible releases within Next.js 16.

## Depends on

- `08-react19-cohort-update.md`

## Scope

- Update Next.js within major 16.
- Align the Next.js ESLint integration with the selected framework release.
- Apply only migration notes relevant to the selected current-major versions.

## Acceptance criteria

- [ ] Next.js remains on major 16.
- [ ] Next.js lint tooling is compatible with the selected framework release.
- [ ] The Next.js example passes lint, type checks, tests, and production build.
- [ ] Frozen installation, repository verification, and its image build pass.
- [ ] No next-major framework migration or unrelated package cohort is included.
- [ ] Relevant release-note review is summarized in the pull request.

## Out of scope

- A future Next.js major migration.
- React changes beyond compatibility corrections required by this cohort.
- Application feature changes.

## Closing notes

Updated Next.js and its ESLint integration to 16.2.11. The release closes advisories affecting the prior 16.1.6 line. Next.js tests, types, production build, frozen install, and full repository verification pass.
