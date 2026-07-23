---
title: "Make dependency updates safe and routine"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Problem Statement

Maintainers cannot confidently apply routine package updates because compatibility knowledge and verification behavior are spread across workspace manifests, Turbo tasks, native test runners, release automation, and image builds. Automated updates can be approved based on version metadata without one repository-owned result proving that the Next.js example, React Router example, Express example, Spring Boot Item example, and their production builds still work.

The repository also presents conflicting Node runtime expectations, updates related packages independently even when they form a compatibility cohort, and provides no automated update adapter for Maven or Docker images. This makes routine maintenance noisy and makes larger upgrades harder to distinguish from safe current-major updates.

## Solution

Create one deep repository verification module with a small `pnpm verify` interface. Each application and shared package will provide a deterministic task adapter using its existing native tooling. Pull requests and dependency automation will cross the same verification seam before merge.

Normalize the repository on Node 24, make image builds use the lockfile-resolved Turbo implementation, encode repeated compatibility cohorts with pnpm catalogs, and configure update automation around those cohorts and ecosystems. Once those foundations pass, update packages in bounded current-major cohorts, one cohort per ticket and pull request.

The shared shadcn source remains intentionally low-priority. Knip findings and broad UI cleanup are not part of this program.

## User Stories

1. As a maintainer, I want one verification command, so that I do not need to remember every application’s native tooling.
2. As a contributor, I want local verification to match pull-request verification, so that a local pass predicts CI behavior.
3. As a maintainer, I want every verification task to be non-interactive, so that automation cannot hang in watch mode.
4. As a Next.js example maintainer, I want lint, types, tests, and production build checks to run, so that framework updates are behaviorally validated.
5. As a React Router example maintainer, I want its existing tests to be reachable through the repository verification seam, so that updates cannot silently omit them.
6. As an Express example maintainer, I want HTTP tests and TypeScript build checks to remain part of verification, so that middleware updates preserve endpoint behavior.
7. As a Spring Boot Item example maintainer, I want Maven verification to run rather than a test-skipping package build, so that Java updates exercise the documented test hierarchy.
8. As a maintainer, I want a failed workspace to be named in verification output, so that update failures have locality.
9. As a maintainer, I want verification to fail on lint, type, test, coverage-check, packaging, or build failures, so that success has one clear meaning.
10. As a maintainer, I want pull requests to complete verification before release automation, so that metadata processing never masks a broken change.
11. As a maintainer, I want Dependabot updates to pass the same required checks as human changes, so that automated updates receive no weaker treatment.
12. As a maintainer, I want absent, skipped, cancelled, or stale verification results to block auto-merge, so that metadata approval alone is insufficient.
13. As a maintainer, I want major-version updates to remain review-required, so that migration work is never mistaken for routine maintenance.
14. As a contributor, I want one supported Node major, so that local development, CI, type declarations, and image builds agree.
15. As a maintainer, I want Node 24 used consistently, so that current framework and tooling updates are not blocked by an obsolete minimum runtime.
16. As a maintainer, I want image builds to use the repository-pinned Turbo release, so that an unchanged commit cannot acquire different pruning behavior from a global install.
17. As a maintainer, I want frozen installs in verification and image builds, so that manifest and lockfile drift fails immediately.
18. As a maintainer, I want pull requests to build all four images without pushing them, so that production-build regressions appear before merge.
19. As a release operator, I want post-merge image publishing to reuse the same build implementation as pull-request validation, so that the two paths do not drift.
20. As a maintainer, I want compatible package families represented as cohorts, so that related packages move atomically.
21. As a maintainer, I want React and React DOM constraints aligned across consumers and peers, so that shared UI portability remains truthful.
22. As a React Router example maintainer, I want all Router v7 packages updated together, so that the SSR adapter does not resolve a mixed framework graph.
23. As a tooling maintainer, I want repeated ESLint and TypeScript versions governed in one place, so that configuration consumers do not drift.
24. As a test maintainer, I want Vitest runtime, UI, and coverage packages kept compatible, so that test tooling updates remain deterministic.
25. As a maintainer, I want each frontend’s Supabase packages updated independently, so that their idiomatic auth implementations retain locality.
26. As a Spring Boot Item example maintainer, I want Maven dependencies discovered automatically, so that Java maintenance is not invisible to npm tooling.
27. As a maintainer, I want Docker base-image updates discovered for every application, so that runtime maintenance is not manual.
28. As a maintainer, I want update automation grouped by ecosystem and compatibility cohort, so that pull requests are reviewable and coherent.
29. As a maintainer, I want current-major maintenance separated from major migrations, so that rollback and diagnosis remain local to one change.
30. As a template user, I want the examples to stay independently idiomatic, so that maintenance infrastructure does not force false application sharing.
31. As a template user, I want routine package updates without a broad shadcn rewrite, so that the template remains recognizable and easy to refresh from upstream.
32. As an automated agent, I want implementation-ready tickets with explicit dependencies and acceptance criteria, so that work can proceed safely without rediscovering the architecture.

## Implementation Decisions

- The highest test seam is the repository verification module. Its external interface is `pnpm verify`; native runners remain implementation details behind task adapters.
- Verification will cover deterministic lint, type checks, tests, and production builds. A successful build does not substitute for tests.
- The React Router example will expose its existing Vitest behavior through a non-watch task adapter.
- The Next.js example will use a non-watch Vitest task and correct its stale test discovery configuration before it participates in the repository verifier.
- The Spring Boot Item example will adapt Maven `verify` into the workspace task graph. Surefire, Failsafe, JaCoCo checks, and packaging must be reachable through that adapter.
- Pull-request automation will invoke the same repository verification interface used locally.
- Changesets release behavior will run only after verification succeeds and will retain its existing publish semantics.
- Dependabot auto-merge remains limited to eligible non-major updates and depends on required behavior-based checks for the final commit.
- Node 24 is the only supported Node major for workspace development, CI, type declarations, and all Node image stages. Java remains on Java 21.
- Image builds will use the Turbo release resolved by the repository lockfile, not a mutable global installation.
- Pull-request and post-merge image builds will share one reusable implementation. Pull requests build without pushing; eligible branch and tag runs may publish.
- pnpm catalogs will encode compatibility cohorts that repeat across manifests. Catalogs centralize version policy but do not merge the independent frontend implementations.
- Update automation groups will mirror compatibility cohorts where the updater supports them.
- The root npm update adapter remains the single npm workspace discovery point, preserving pnpm workspace locality.
- Separate Maven and Docker update adapters will be added because they are real seams with different implementations.
- Package updates will be delivered as bounded current-major cohorts. Each cohort receives a frozen install, repository verification, and relevant image builds.
- Supabase updates remain separate for the Next.js and React Router examples because their auth implementations and current baselines differ intentionally.
- Major migrations receive separate future specs or tickets and never ride along with current-major maintenance.
- No ADR is required for this work because it deepens existing pnpm, Turbo, Maven, Docker, and independent-frontend decisions rather than replacing them.

## Testing Decisions

- Good tests assert behavior through the highest existing seam and do not inspect orchestration implementation details.
- The primary acceptance test is a clean frozen install followed by the repository verification interface on Node 24 and Java 21.
- Next.js verification will exercise its lint, type, test, and production-build interfaces.
- React Router verification will exercise lint, type, existing header/security behavior, and production build through its own adapter.
- Express verification will retain Jest HTTP tests against the existing server factory seam and its TypeScript build.
- Spring Boot verification will use Maven’s existing test hierarchy and Item HTTP/persistence behavior through Maven `verify`.
- Failure-injection checks will prove that a failing assertion in each native runner causes the repository verifier to fail and identify the owning workspace.
- Failure-injection checks will prove that TypeScript and lint failures cannot be hidden by a prior Turbo cache hit.
- A deliberately mismatched manifest and lockfile will prove frozen installation fails before verification.
- Turbo dry-run or summary output will prove that shared-package changes invalidate dependent tasks while unrelated tasks may remain cached.
- Pull-request image validation will prove all four Dockerfiles build without publishing or requiring production credentials.
- Dependabot test pull requests will prove Maven and Docker adapters discover updates and remain subject to the required verification gate.
- Package cohort tickets test resolved compatibility and external behavior, not the textual placement of catalog entries.
- Prior art includes the Express HTTP tests, the React Router header test, the Next.js Vitest setup, and the Spring Boot unit/integration test hierarchy already present in the repository.
- Browser end-to-end testing, live Supabase calls, and Docker Compose runtime orchestration are not required for every package update.

## Out of Scope

- Knip cleanup or making Knip a required update gate.
- Refactoring or replacing default shadcn source in the shared UI package.
- Consolidating the independent Next.js and React Router examples.
- Replacing pnpm, Turborepo, Dependabot, Changesets, Maven, or Docker Compose.
- New product behavior, Item domain changes, auth-flow redesigns, or theme changes.
- Broad test-suite expansion, new coverage thresholds, performance benchmarks, or browser end-to-end infrastructure.
- React Router 8, Express 5, ESLint 10, the next TypeScript major, Jest 30, Vitest 5, Spring Boot 4, or other major migrations.
- Automated Terraform, Supabase CLI, operating-system package, or Maven-wrapper updates unless separately ticketed.
- Changing branch-protection configuration through repository code; maintainers must require the resulting stable check names in repository settings.

## Further Notes

The implementation order is intentional: complete native task adapters, establish local verification, require it in pull requests, normalize runtime and image builds, add update automation, then execute package cohorts. Package-update tickets must not start before the verification foundation passes.

The two frontend examples remain independent per the multi-frontend ADR. Shared catalogs create version-policy locality only; they do not introduce shared application behavior.
