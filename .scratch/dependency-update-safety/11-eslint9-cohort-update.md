---
title: "Update the ESLint 9 tooling cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Update ESLint 9 and its compatible parser, plugin, and shared configuration dependencies as one tooling cohort.

## Depends on

- `06-pnpm-compatibility-catalogs.md`
- `07-maven-docker-update-adapters.md`

## Scope

- Update ESLint within major 9.
- Update the compatible `@eslint/js`, TypeScript-ESLint, React, Turbo, and formatting integrations required by the shared ESLint module.
- Avoid unrelated rule redesign or source-wide formatting.

## Acceptance criteria

- [ ] All direct ESLint declarations resolve through the ESLint 9 cohort.
- [ ] Shared ESLint module exports remain consumable by every existing workspace.
- [ ] Every workspace lint task passes with its existing warning policy.
- [ ] Frozen installation, repository verification, and image builds pass.
- [ ] No ESLint 10 dependency is introduced.
- [ ] Source changes are limited to compatibility corrections required by updated lint behavior.

## Out of scope

- ESLint 10.
- New lint policy or mass formatting.
- TypeScript major changes.

## Closing notes

Kept ESLint on 9.39.2 and updated the TypeScript-ESLint parser, plugin, and aggregate package to 8.65.0. Existing warning budgets were not raised and full lint plus repository verification pass.
