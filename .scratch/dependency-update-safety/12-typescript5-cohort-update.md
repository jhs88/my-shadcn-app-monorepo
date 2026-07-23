---
title: "Align the TypeScript 5 tooling cohort"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Align direct TypeScript declarations on one supported TypeScript 5 cohort, removing the older 5.5 line from the Express and logger examples.

## Depends on

- `11-eslint9-cohort-update.md`

## Scope

- Update direct TypeScript declarations to one compatible TypeScript 5 release.
- Include only compiler-adjacent corrections required by the selected release.
- Preserve existing shared TypeScript module semantics unless compatibility requires a narrow correction.

## Acceptance criteria

- [ ] Every direct TypeScript declaration remains on major 5 and resolves to the selected cohort.
- [ ] Express and logger no longer retain a separate TypeScript 5.5 line.
- [ ] All workspace type checks and builds pass.
- [ ] Jest and ts-jest remain compatible with the selected compiler release.
- [ ] Frozen installation, repository verification, and image builds pass.
- [ ] No next-major TypeScript migration or new strictness policy is introduced.

## Out of scope

- The next TypeScript major.
- New compiler strictness flags.
- Broad source modernization.

## Closing notes

Aligned the Express and logger modules from TypeScript 5.5.4 to 5.9.3. Jest, ts-jest, lint, builds, and full repository verification pass without source migration.
