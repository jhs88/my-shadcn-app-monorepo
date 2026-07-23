---
title: "Add deterministic verification task adapters"
status: closed
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Complete the existing workspace test seams before introducing a repository-wide verifier. Every participating application must expose a deterministic, non-watch task adapter for its native test implementation.

## Depends on

None.

## Scope

- Make existing JavaScript test tasks non-watch commands suitable for CI.
- Expose the React Router example’s existing Vitest test through a workspace test task.
- Correct the Next.js example’s stale test discovery configuration and ensure at least one existing non-UI behavior is exercised.
- Expose Maven `verify` through the Spring Boot Item example’s workspace test task.
- Bind the Maven integration-test implementation so matching integration tests run during `verify`.

## Acceptance criteria

- [ ] The React Router test task runs its existing header/security test and exits.
- [ ] The Next.js test task exits without watch mode and executes at least one test.
- [ ] Existing Express and logger Jest tasks still pass.
- [ ] The Spring Boot test task runs Maven verification, unit tests, matching integration tests, JaCoCo checks, and packaging.
- [ ] A failing test in each native runner makes its workspace task fail.
- [ ] No task depends on an interactive watcher, live third-party system, or missing test path.

## Out of scope

- Broad UI or browser test coverage.
- New coverage thresholds.
- Product behavior changes.

## Closing notes

Implemented on `feat/dependency-update-safety`. Frontend Vitest adapters are non-watch, Next.js covers browser and server QueryClient behavior, and Maven now runs a clean verification lifecycle with Surefire, bound Failsafe goals, verify-phase JaCoCo reporting/checking, and packaging. Focused tests and the repository verifier pass.
