---
title: "Make workflow actions and CLI tools reproducible"
status: open
labels: [ready-for-agent]
created: 2026-07-23
---

## Description

Remove mutable workflow tool selectors so update automation can discover and verify every change through an explicit version seam.

## Depends on

- `03-pr-verification-and-automerge-gate.md`
- `07-maven-docker-update-adapters.md`

## Scope

- Align supported first-party action releases where feasible.
- Replace mutable third-party branch selectors and `latest` CLI versions with explicit maintained versions or immutable revisions.
- Keep readable release annotations for immutable action revisions.
- Add workflow validation that rejects mutable selectors for covered tools.
- Reduce permissions to the minimum required by each job where changes are local and behavior-preserving.

## Acceptance criteria

- [ ] Covered workflows contain no unreviewed `master` or `latest` selectors.
- [ ] Third-party actions use explicit maintained releases or immutable revisions.
- [ ] Supabase CLI and Deno setup select explicit versions.
- [ ] Workflow syntax validation passes.
- [ ] Dependabot can discover supported action updates.
- [ ] Repository verification and workflow-specific checks pass.
- [ ] Permission reductions do not break release, type-generation, or database workflow behavior.

## Out of scope

- Rewriting database workflows.
- Replacing GitHub Actions.
- Terraform or Supabase architecture changes.
