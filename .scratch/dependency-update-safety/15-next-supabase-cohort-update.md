---
title: "Update the Next.js Supabase cohort"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update the Next.js example’s Supabase SSR and JavaScript client packages as one compatibility cohort after Node 24 verification is established.

## Depends on

- `04-node24-and-reproducible-turbo.md`
- `09-next16-cohort-update.md`

## Scope

- Update Supabase SSR and JavaScript client packages to mutually compatible current releases.
- Review cookie-handling, auth callback, server action, and image-storage release notes.
- Keep changes local to the Next.js example’s idiomatic auth implementation.

## Acceptance criteria

- [ ] Supabase SSR peer requirements are satisfied by the selected JavaScript client release.
- [ ] Next.js lint, types, tests, and production build pass.
- [ ] Existing login, signup, logout, confirmation, OAuth callback, and protected-route behavior receive a documented local smoke result when a local Supabase environment is available.
- [ ] Frozen installation, repository verification, and the Next.js image build pass.
- [ ] No React Router auth implementation changes are included.
- [ ] Release-note review and any unavailable smoke checks are documented in the pull request.

## Out of scope

- Auth-flow redesign, schema changes, or RLS changes.
- React Router Supabase updates.
- Live production credentials in CI.
