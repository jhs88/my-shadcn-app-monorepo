---
title: "Update the React Router 7 compatibility cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the complete React Router v7 family atomically without crossing the React Router 8 migration seam.

## Depends on

- `08-react19-cohort-update.md`

## Scope

- Update React Router and all direct `@react-router` packages to one compatible v7 release.
- Include directly coupled Router tooling only when required by peer constraints.
- Review current-major release notes for SSR, Express adapter, route generation, and CSP implications.

## Acceptance criteria

- [ ] React Router and every direct `@react-router` dependency remain on one compatible v7 line.
- [ ] No mixed Router release graph remains in the lockfile.
- [ ] React Router lint, type checks, existing header/security test, and production build pass.
- [ ] Frozen installation, repository verification, and its image build pass.
- [ ] No React Router 8 dependency or unrelated Sentry major migration is introduced.
- [ ] Relevant release-note review is summarized in the pull request.

## Out of scope

- React Router 8.
- Loader/action, route convention, CSP, or SSR architecture changes.
- Sentry 10 migration.

## Closing notes

Pinned all six direct React Router packages to exactly 7.18.1. The lockfile contains no Router v8 or mixed v7 cohort. Router tests, type generation, lint, production build, and full verification pass.
