---
title: "Reuse container builds before and after merge"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Place the four-image build matrix behind one reusable workflow implementation. Pull requests use a build-only adapter; eligible branch and tag runs use the same implementation with publishing enabled.

## Depends on

- `04-node24-and-reproducible-turbo.md`

## Scope

- Reuse one image-build implementation for the Express, Spring Boot, Next.js, and React Router images.
- Enable pull-request image builds without publishing.
- Preserve existing eligible image publishing after merge.
- Remove or replace the unused deploy action if it fails the deletion test.
- Ensure pull-request builds do not require production credentials or remote-cache secrets.

## Acceptance criteria

- [ ] Every pull request builds all four images.
- [ ] Pull-request runs never authenticate to the registry or push images.
- [ ] Eligible branch and tag runs publish using the same build implementation.
- [ ] Each image uses the normalized Node/Turbo implementation where applicable.
- [ ] A broken pruned workspace, frozen install, Maven package, or production build fails its matrix target.
- [ ] The unused deploy action is either removed or has at least two real adapters that justify its seam.

## Out of scope

- Starting Docker Compose in pull requests.
- Live Supabase or external-system smoke tests.
- Deployment environment redesign.
