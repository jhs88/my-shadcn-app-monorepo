# Moon ideas for the publication and promotion lifecycle

## Question and version boundary

This addendum asks which Moon primitives should influence the lifecycle around an immutable four-image release. The repository pins `@moonrepo/cli` 2.4.6. Current Moon documentation is for v2, but may describe later v2 releases; the lifecycle should therefore use only behavior documented as present by 2.4.6 and should invoke the package-pinned binary (`pnpm exec moon`). The broader capability boundary remains unchanged: Moon selects and executes repository work; GitHub Actions and OCI/deployment tooling publish, attest, approve, promote, deploy, and retain evidence. Moon's own comparison still lists continuous-deployment support as unavailable. [Moon comparison](https://moonrepo.dev/docs/comparison#task-runner)

## Findings that affect lifecycle design

### Make affected selection an explicit, preserved input

`moon ci` determines changed files from a base/head comparison, selects affected targets, adds graph relations, creates an action graph, and executes it. Its preset includes affected filtering, deep upstream traversal, direct downstream traversal, `runInCI` filtering, and continue-on-failure behavior. Explicit targets passed to `moon ci` are still affected-filtered. [CI command](https://moonrepo.dev/docs/commands/ci), [CI guide](https://moonrepo.dev/docs/guides/ci)

For a publication candidate, the workflow should set and record immutable `MOON_BASE` and `MOON_HEAD` commit SHAs rather than rely on CI-provider auto-detection. Moon requires full commit history for accurate merge-base/change calculation and recommends a blobless full-history checkout when transfer size matters. [CI revision comparison and checkout guidance](https://moonrepo.dev/docs/guides/ci#comparing-revisions)

This is directly applicable to the pinned release: Moon 2.4.6 fixed CI-provider revision handling and allows `MOON_BASE`/`MOON_HEAD` to activate affected calculation without separately passing `--affected`. The workflow should still pass its intent explicitly and retain both SHAs in evidence. [Moon v2.4.6 release](https://github.com/moonrepo/moon/releases/tag/v2.4.6)

The selection artifact should preserve:

- base and head commit SHAs;
- pinned Moon version;
- requested image targets;
- the explicit upstream/downstream policy;
- Moon's affected JSON or CI report; and
- any policy-driven expansion to a full rebuild.

Moon recognizes affectedness from files, configured environment inputs, and graph relations. Any configured environment variable that exists and is non-empty makes the task affected, so ubiquitous variables such as `CI` must not accidentally become selection inputs. Query commands default to no relation traversal, whereas execution defaults differ; automation must spell traversal out rather than assume equivalent results. [Affected concept](https://moonrepo.dev/docs/concepts/affected), [Affected query](https://moonrepo.dev/docs/commands/query/affected)

### Treat the action graph as execution evidence, not release authority

Moon's action graph is a DAG that topologically orders task and setup actions. A task runs once per pipeline even when shared by multiple requested targets. This supports ordered verification and build preparation, but does not provide an atomic registry transaction or environment promotion primitive. [Action graph](https://moonrepo.dev/docs/how-it-works/action-graph), [Task graph](https://moonrepo.dev/docs/how-it-works/task-graph)

`moon ci` defaults to continuing after failures and reports passing, failed, and invalid actions. Publication must therefore gate on the final Moon exit/result and inspect the report; the mere presence of some successful image builds is not candidate success. Tasks marked `allowFailure` do not make `moon ci` fail when they are the only failures, so no publication prerequisite may use `allowFailure`. [CI command](https://moonrepo.dev/docs/commands/ci), [Task option `allowFailure`](https://moonrepo.dev/docs/config/project#allowFailure)

Moon supports task `retryCount`, intended for flaky tasks. Retries are reasonable for side-effect-free verification, but publication, signing, lifecycle-event emission, and deployment must not inherit automatic task retries unless the external operation itself is idempotent and keyed by immutable release or operation identity. A successful retry must remain visible in evidence rather than being flattened into an unqualified pass. [Task option `retryCount`](https://moonrepo.dev/docs/config/project#retryCount)

Moon 2.4 also introduced requirement, condition, and fingerprint checks. They can guard prerequisites, skip already-satisfied work, or include external state in task hashing, but a skipped condition is not registry evidence; publication must still resolve the expected digest independently. [Moon v2.4 checks](https://moonrepo.dev/blog/moon-v2.4)

### Separate cacheable preparation from external side effects

On a cache hit Moon can exit early and reuse the last task result. Setting `cache: false` disables task hashing and persistence of task outputs. Therefore registry pushes, signatures, approvals, lifecycle-event writes, and deployments must be non-cacheable or live outside Moon tasks; a cache hit can prove reusable filesystem output, never that an external side effect occurred in this workflow run or still exists. [Run-task cache behavior](https://moonrepo.dev/docs/run-task), [Task option `cache`](https://moonrepo.dev/docs/config/project#cache)

Moon task dependency cache strategies introduced in v2.3 can reduce rebuilds, but they change cache invalidation rather than release policy. In particular, output-less dependencies default to being ignored for downstream cache invalidation in v2.3. Publication prerequisites whose result must influence a build should therefore be explicit gates, not assumed to affect the build cache merely because they are dependencies. [Moon v2.3 dependency cache strategies](https://moonrepo.dev/blog/moon-v2.3#task-dependency-cache-strategies)

CI and run reports live under `.moon/cache` and may be overwritten or deleted. Moon explicitly instructs consumers to copy them elsewhere for persistence. The report belongs in the candidate evidence bundle, while registry-confirmed OCI digests and signed lifecycle events remain authoritative. [CI reports](https://moonrepo.dev/docs/commands/ci#reports)

### Keep Docker support on the preparation side of the boundary

Moon's Docker commands scaffold dependency-aware source/configuration skeletons, set up focused dependencies, prune production dependencies, and optionally generate a multi-stage Dockerfile. The command family does not define registry publication, digest resolution, attestation, promotion, or rollback. [Docker commands](https://moonrepo.dev/docs/commands/docker), [Docker guide](https://moonrepo.dev/docs/guides/docker)

Consequently, a candidate lifecycle may use Moon to prepare each selected build context, but BuildKit/registry tooling must return and verify the pushed digest. A Moon task output containing a digest is supporting data only until independently resolved against the registry.

## Effect on the proposed lifecycle decisions

### Confirmed

- **Lifecycle objects:** keep release manifests immutable and lifecycle state outside Moon. Nothing in Moon supplies a release-state store.
- **State model:** distinguish publication, per-environment deployment, and derived promotion eligibility. A Moon pipeline result is only one input to candidate validation.
- **Publication authority:** retain the protected GitHub Actions workflow as the only publisher; Moon has no CD or approval authority.
- **Staging gate and production authority:** promote the same digest-pinned release through GitHub environments without rebuilding. Moon can run verification tasks but does not implement promotion gates.
- **Promotion concurrency:** serialize and compare-and-set at the workflow/environment layer; Moon's task DAG is scoped to a run, not concurrent environment mutations.

### Refined

- **Publication trigger:** the explicit release workflow must pin and retain base/head commit SHAs, full-history checkout behavior, Moon 2.4.6, targets, and traversal policy. A tag remains only a request/alias.
- **Affected builds:** Moon's result is a proposal, not a publication decision. Use explicit base/head SHAs and explicit relation depth; preserve the selection report; allow policy to expand but never silently contract the selected rebuild set.
- **Candidate success:** require every non-optional Moon prerequisite to succeed after any disclosed retries, then independently validate all registry digests and evidence. Partial action success cannot publish a partial release.
- **Task placement:** limit Moon to cacheable, side-effect-free verification and build-context preparation. Keep pushes, signing, lifecycle writes, promotion, and deployment non-cacheable and preferably outside Moon.

### Challenged

No proposed lifecycle decision is contradicted. The main caution is that `moon ci :build` is not an unconditional request to build all named targets: it remains affected- and `runInCI`-filtered. Any full-rebuild path must deliberately bypass that selection behavior rather than infer completeness from the target list.

## Recommended lifecycle rule

Record Moon's selection and execution report as signed supporting evidence for the candidate, but let the protected publication workflow independently establish the release: registry-resolve all four digests, validate the immutable manifest and attestations, then emit the append-only `published` event. Promotion must consume that already-published release without rerunning image builds.
