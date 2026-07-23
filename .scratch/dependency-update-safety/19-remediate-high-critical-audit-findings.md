---
title: "Remediate high and critical dependency audit findings"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

The verified current-major upgrade cohorts still leave high and critical advisories in transitive dependency paths. Separate actionable same-major fixes from advisories that require upstream releases or dedicated major migrations.

## Depends on

- `08-react19-cohort-update.md`
- `09-next16-cohort-update.md`
- `10-react-router7-cohort-update.md`
- `11-eslint9-cohort-update.md`
- `13-vitest4-cohort-update.md`

## Scope

- Update Vite within major 6 to a release containing current security fixes.
- Update compatible Tailwind build tooling and its archive dependencies without crossing Tailwind major 4.
- Remove the unused UI generator dependency if the deletion test confirms no caller.
- Update safe patched transitive releases for PostCSS, WebSocket, form-data, glob matching, and archive handling where parent ranges permit.
- Classify remaining advisories as runtime, build-time, test-only, unreachable, awaiting upstream, or requiring a dedicated major migration.
- Prefer parent-package updates over broad overrides; use a narrowly scoped override only when compatibility is documented and verified.

## Acceptance criteria

- [ ] Frozen installation succeeds.
- [ ] Full repository verification passes.
- [ ] React Router remains on v7 and Vite remains on v6.
- [ ] No critical advisory remains in an installed runtime or build path when a compatible patched release exists.
- [ ] Every remaining high or critical advisory has a documented path, exposure classification, and remediation owner.
- [ ] Any override names its parent path and is covered by the relevant test/build seam.
- [ ] The audit result before and after remediation is recorded.

## Out of scope

- React Router 8, Express 5, ESLint 10, Jest 30, Spring Boot 4, or other major migrations.
- Rewriting default shadcn source.
- Claiming an unavailable upstream patch exists.
