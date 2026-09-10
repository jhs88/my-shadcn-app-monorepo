# Moon capabilities for immutable image delivery

## Research question and conclusion

For this repository's pinned `@moonrepo/cli` 2.4.6, Moon can be the change-aware task orchestrator that selects work, expands the task graph through dependencies, caches declared filesystem outputs, emits a machine-readable CI run report, and prepares dependency-complete Docker build contexts. It should **not** be the release authority or evidence system. GitHub Actions and purpose-built OCI/deployment tools must build and push images, capture registry digests and attestations, assemble and promote release manifests, deploy digest-pinned releases, verify runtime state, roll back, and durably retain evidence.

This conclusion also matches Moon's own feature comparison: Moon provides CI support but lists continuous deployment support as unavailable. [Moon feature comparison](https://moonrepo.dev/docs/comparison#task-runner)

## Version applicability

The repository pins `@moonrepo/cli` to `2.4.6` in `package.json` and the lockfile. Moon's current documentation identifies itself as documentation for Moon v2, so it is the applicable major-version documentation, but pages can also describe features added after 2.4.6. This report therefore relies only on primitives whose documentation marks them as introduced no later than 2.4.6, or whose presence was already exercised by the repository's 2.4.6 prototypes. In particular:

- `moon query affected` is marked as available since v2.0.0. [Affected query command](https://moonrepo.dev/docs/commands/query/affected)
- Docker file generation predates v2 and its relevant `--no-setup` and template additions are marked v2.0.0. [Docker file command](https://moonrepo.dev/docs/commands/docker/file)
- file/object output forms and optional outputs were introduced in v1.41. [Moon v1.41 release notes](https://moonrepo.dev/blog/moon-v1.41)
- dependency `cacheStrategy` and the experimental local CAS are v2.3 features and therefore exist in 2.4.6, although neither is necessary for the delivery contract proposed here. [Moon v2.3 release notes](https://moonrepo.dev/blog/moon-v2.3)

The current `.moon/workspace.yml` says `versionConstraint: ">=2.4.6"`, while the package dependency is exact. That constraint does not itself prevent a future globally installed Moon version; delivery CI should invoke the package-pinned binary (`pnpm exec moon`) if exact-version behavior is required.

## Capability boundary

| Concern | Moon 2.4.6 primitive | Reliable use in this effort | Boundary / required owner |
| --- | --- | --- | --- |
| Affected selection | `moon ci`, `moon query affected`, task `inputs`, VCS base/head | Select projects/tasks affected by files, configured environment inputs, and graph relations | GitHub Actions must provide complete Git history and an unambiguous comparison range; release policy must decide when to force a full build |
| Dependency closure | project `dependsOn`, task `deps`, `--upstream` / `--downstream` | Expand selected work through direct or deep dependencies/dependents and execute the resulting DAG | The repository must model every build dependency correctly; Moon cannot infer missing semantic/runtime coupling |
| Task outputs | task `outputs`, local/remote cache and hydration | Declare produced files/globs and cache/hydrate them by task hash | Outputs are build-cache artifacts, not an OCI digest ledger or retention-grade release evidence |
| CI reports | `.moon/cache/ciReport.json`, `.moon/cache/runReport.json`; optional `moonrepo/run-report-action` | Record selected actions and execution results; render a PR comment/workflow summary | Reports live under a cache directory and must be copied/uploaded for persistence; GitHub remains the durable evidence carrier |
| Docker preparation | `moon docker scaffold`, `setup`, `prune`, optional `file` generation | Produce focused dependency-aware build contexts, install dependencies, and prune production content | Docker/BuildKit and the registry must build, publish, resolve digests, and attest images |
| Publication and delivery | No CD primitive | Moon may invoke repository tasks that wrap external commands, but adds no publication semantics | GitHub Actions plus OCI tooling own push, digest capture, SBOM/provenance, signing, release manifests, promotion, deploy, rollback, verification, and retention |

## Affected selection and dependency closure

Moon defines an affected state from changed files, configured environment inputs, and graph relations. Project-local file changes affect a project; task changes are evaluated against task `inputs`. A configured non-empty environment variable counts as affected. Relation traversal is controlled by `--upstream` and `--downstream`, each supporting `none`, `direct`, and `deep`. Exec-based commands default to deep upstream traversal and no downstream traversal; query commands default to neither. [Affected concept](https://moonrepo.dev/docs/concepts/affected)

`moon query affected` returns affected projects and tasks as JSON and can explicitly include upstream or downstream relationships. It is suitable for an auditable selection preview or for deciding which image-building tasks are candidates. [Affected query command](https://moonrepo.dev/docs/commands/query/affected)

`moon ci` compares the current revision with a detected/configured base, filters affected tasks through `runInCI`, builds an action/dependency graph, and executes it. Its documented preset includes `--affected`, deep upstream traversal, and direct downstream traversal. Explicit targets such as `moon ci :build` remain affected-filtered. [CI command](https://moonrepo.dev/docs/commands/ci), [CI guide](https://moonrepo.dev/docs/guides/ci)

For immutable image publication, dependency closure and image publication selection are related but not identical. Moon can answer which build tasks are affected according to the modeled graph. Release policy must still decide whether a four-image release permits selective rebuilding or requires all four images, and must carry forward unchanged, previously published digests when a release manifest contains images that were not rebuilt. A conservative release can force explicit image targets without affected filtering.

The shadow prototype found an important configuration hazard consistent with the docs: because `CI=true` is always non-empty in GitHub Actions, including `$CI` as a task input makes every such task affected. The prototype correctly removed it from `implicitInputs` while leaving it in the process environment. This is not a Moon defect; it follows Moon's documented environment-input rule. The prototype also correctly calls for full Git history because affected computation depends on a valid VCS comparison.

## Outputs and CI evidence

Task `outputs` declare files or directories produced by a task and enable incremental caching and hydration. Moon supports literals and globs; file outputs can be optional. [Project/task configuration: outputs](https://moonrepo.dev/docs/config/project#outputs), [Moon v1.41 output changes](https://moonrepo.dev/blog/moon-v1.41)

This makes outputs appropriate for build products and generated metadata used by downstream tasks. It does not make `.moon/cache` a release evidence store: workspace cache entries are subject to automatic cleanup, with a documented default lifetime of seven days, and CI/run reports may be overwritten or deleted. [Workspace pipeline cache configuration](https://moonrepo.dev/docs/config/workspace#pipeline), [CI command reports](https://moonrepo.dev/docs/commands/ci#reports)

After execution, `moon ci` writes `.moon/cache/ciReport.json`; non-CI execution writes the same report format to `.moon/cache/runReport.json`. Moon explicitly instructs users to copy the report elsewhere, such as a CI artifact, for persistence. Its first-party GitHub report action can turn the report into a pull-request comment and workflow summary. [CI command reports](https://moonrepo.dev/docs/commands/ci#reports), [CI reporting guide](https://moonrepo.dev/docs/guides/ci#reporting-run-results)

Therefore a durable publication evidence bundle may include the Moon report as supporting evidence of build selection and task outcomes, but cannot use it as proof of publication. The authoritative bundle must separately record each pushed OCI digest, source revision, builder/workflow identity, attestations, release-manifest identity, and artifact retention location.

## Docker orchestration: what Moon does and does not do

Moon's Docker commands integrate the project graph with Dockerfile construction:

- `moon docker scaffold` creates configuration and source skeletons. The sources skeleton contains the selected project's sources and its modeled project dependencies; the command requires all relevant projects to be configured or required files may be omitted. [Docker scaffold command](https://moonrepo.dev/docs/commands/docker/scaffold)
- `moon docker setup` installs focused toolchain and project dependencies inside the prepared environment, while `moon docker prune` reduces the resulting production environment. The Docker command family consists of `file`, `prune`, `scaffold`, and `setup`. [Docker commands](https://moonrepo.dev/docs/commands/docker)
- `moon docker file` can generate a multi-stage production Dockerfile using scaffold/setup/build/prune/start phases, and custom Dockerfiles can use these primitives directly. [Docker file command](https://moonrepo.dev/docs/commands/docker/file), [Docker integration guide](https://moonrepo.dev/docs/guides/docker)

These are build-context and Dockerfile orchestration facilities. The official command family documents no registry login, build/push publication contract, OCI digest resolution, image signing, provenance/SBOM generation, environment promotion, runtime deployment, health verification, or rollback primitive. Moon's feature comparison explicitly marks CD support unavailable. [Docker commands](https://moonrepo.dev/docs/commands/docker), [Moon feature comparison](https://moonrepo.dev/docs/comparison#task-runner)

Accordingly, a Moon task may wrap `docker buildx`, an OCI client, or an attestation tool, but correctness then belongs to that external command and the GitHub Actions workflow. Merely declaring a digest JSON file as a Moon task output makes it cacheable; it does not prove that the referenced registry object still exists or that the file came from the current push. Publication tasks that have external side effects should not be treated as ordinary replayable cache hits.

## Reconciliation with the repository prototypes

`docs/prototypes/moon-migration.md` is directionally correct:

- Its explicit `--upstream` and `--downstream` choice matches the documented traversal model.
- Its narrowed output globs match Moon's output-validation and hydration role better than broad declarations for artifacts a command does not create.
- Its insistence on prototyping all four Dockerfiles is still necessary. Moon scaffolding depends on a complete project graph, while this repository spans JavaScript and Java applications and currently uses Turbo pruning paths.
- Its recommendation for a non-blocking `moon ci` pilot with full Git history remains the right prerequisite to adopting affected release selection.

`docs/prototypes/moon-ci-shadow.md` also remains correct but is verification evidence only. It copies ephemeral reports before artifact upload, which follows the official persistence warning. It deliberately defers Docker builds and deployment, so it proves neither image publication nor rollback. Its `$CI` correction is required by Moon's documented rule that a configured non-empty environment input is affected.

One wording refinement is important: Moon's Docker integration can **prepare** a dependency-complete context and orchestrate build tasks inside a Dockerfile, but it does not orchestrate immutable publication in the release-management sense. The delivery specification should avoid describing `moon docker` as the publisher.

## Recommended ownership in the delivery specification

Moon should own:

1. computing/reporting affected tasks from a well-defined Git range;
2. applying modeled upstream/downstream closure;
3. executing verification and image-preparation tasks in dependency order;
4. declaring and caching filesystem outputs;
5. emitting the CI run report; and
6. scaffolding focused Docker contexts after all four Docker paths are proven.

GitHub Actions and dedicated tools should own:

1. checkout depth, base/head selection, concurrency, permissions, approvals, and environment gates;
2. Docker/BuildKit builds and registry pushes;
3. resolving the registry-confirmed digest for every image and forbidding tags as deployment identity;
4. SBOM and provenance generation, signing/verification if adopted, and linkage to source/workflow identity;
5. assembling the atomic four-service release manifest, including carried-forward digests;
6. staging-to-production promotion without rebuilding;
7. digest-pinned deployment, runtime digest inspection, health and smoke checks;
8. automatic/manual rollback with data-compatibility safeguards; and
9. checksummed or signed durable evidence retention independent of `.moon/cache`.

## Decision answer

Adopt Moon as an additive selector and task/Docker-context orchestrator, not as the immutable publication or rollback authority. Persist its CI JSON report inside the broader evidence bundle as proof of selection and task execution. Make registry-derived digests and deployment-observed runtime identity the authoritative publication and rollback evidence, produced and retained by GitHub Actions plus OCI/deployment tooling.

## Context pointer

Intended throwaway research branch: `research/moon-delivery-capabilities`.

Canonical findings file: `docs/research/moon-immutable-image-delivery.md`.

No branch was created or switched during this research because the shared working tree is concurrently used; the primary Wayfinder session can record this pointer on the ticket safely.
