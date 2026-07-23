---
title: "Update the React Router Supabase cohort"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the React Router example’s Supabase SSR and JavaScript client packages independently from the Next.js example.

## Depends on

- `04-node24-and-reproducible-turbo.md`
- `10-react-router7-cohort-update.md`

## Scope

- Update Supabase SSR and JavaScript client packages to mutually compatible current releases.
- Review server/client cookie handling, loader/action auth, OAuth callback, and CSP interactions.
- Keep changes local to the React Router example’s idiomatic implementation.

## Acceptance criteria

- [ ] Supabase SSR peer requirements are satisfied by the selected JavaScript client release.
- [ ] React Router lint, types, existing tests, and production build pass.
- [ ] Existing login, signup, logout, confirmation, OAuth callback, and protected-route behavior receive a documented local smoke result when a local Supabase environment is available.
- [ ] Frozen installation, repository verification, and the React Router image build pass.
- [ ] No Next.js auth implementation changes are included.
- [ ] Release-note review and any unavailable smoke checks are documented in the pull request.

## Out of scope

- Auth-flow redesign, schema changes, or RLS changes.
- Next.js Supabase updates.
- Live production credentials in CI.
