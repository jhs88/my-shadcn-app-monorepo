# Moon starter cutover assessment

Assessed on 2026-10-27 against Moon 2.6.4, its official source, installed CLI
help, and this repository. The completion plan lives in
[the starter guide](../starter/moon-migration.md).

## Recommendation

Finish the migration through one cutover PR after the current correctness and
runtime checks pass. Remote caching and immutable delivery infrastructure are
optional operational projects. They do not need to block a reusable starter.

Root commands and publication currently use Turbo. Local Compose uses Moon
Dockerfiles. Keep that boundary explicit until root scripts, canonical
Dockerfiles, publication, and documentation can change together. The current
starter work prepares those checks and repairs cache inputs; it does not declare
the canonical cutover complete.

## Command and release behavior

`moon run :build` runs all builds with upstream task dependencies. Its default
downstream scope is `none`. Adding `--affected` alone does not implement a
release policy that includes every consumer.
[Run documentation](https://moonrepo.dev/docs/commands/run),
[2.6.4 execution defaults](https://github.com/moonrepo/moon/blob/v2.6.4/crates/action-graph/src/action_graph_builder.rs#L68).

`moon ci` always selects affected tasks and respects `runInCI`, even with
explicit targets. Its defaults include deep upstream tasks, direct downstream
tasks, and continued execution after individual failures. It can add checks that
depend on a requested build, so it is not a build-only publication command.
[CI documentation](https://moonrepo.dev/docs/commands/ci),
[2.6.4 implementation](https://github.com/moonrepo/moon/blob/v2.6.4/crates/app/src/commands/ci.rs#L35).

For optional affected verification, use explicit immutable base/head revisions
and relation traversal:

```sh
pnpm exec moon ci :lint :check-types :test :build --include-relations --upstream deep --downstream deep --base "$BASE_SHA" --head "$HEAD_SHA"
```

Traversal flags do not repair missing file inputs. Always-present configured
environment inputs can also make tasks affected on every run. Keep `$CI` outside
global implicit inputs.
[Affected graph relations](https://moonrepo.dev/docs/concepts/affected#graph-relations),
[2.6.4 affected checks](https://github.com/moonrepo/moon/blob/v2.6.4/crates/affected/src/task_tracker.rs#L53).

Use `moon run :build && changeset publish` as the first publication adapter.
Full builds ensure clean artifacts exist for every package Changesets publishes.
Add affected publication only after specifying its comparison base, downstream
selection, and artifact requirements.

## Cache and development corrections

The assessment found that `^:build` did not include a shared UI task hash
because `@repo/ui` has no build task. A cached React Router build could
therefore miss UI source changes. Type-check ordering alone also did not hash
shared source: dependencies without outputs default to an ignored cache
strategy.
[Dependency cache strategy](https://moonrepo.dev/docs/config/project#cache-strategy),
[2.6.4 dependency hashing](https://github.com/moonrepo/moon/blob/v2.6.4/crates/task-hasher/src/task_hashing.rs#L85).

The starter change adds shared-package sources, root manifests and policy files,
the Node pin, and root helpers to `.moon/tasks/all.yml#implicitInputs`. This
conservative choice runs some extra tasks in exchange for reliable invalidation.
Narrower external-project inputs can follow when their complexity is justified.
[External project inputs](https://moonrepo.dev/docs/config/project#external-projects).

Keep Next's complete standalone output uncached until its pnpm symlink archiving
and restoration are proved under the selected Moon version. Preserve Java's
`test -> build` dependency because both Maven commands clean and write `target`.
These are correctness choices, not incomplete migration requirements.

Ordinary dev/start scripts already infer persistent, uncached tasks outside CI.
The starter change gives `api:dev` an initial logger build and explicitly makes
the E2E server persistent and uncached. Browser/bootstrap tasks remain uncached
because their result depends on running database state.
[Persistent task rules](https://moonrepo.dev/docs/config/project#persistent).

## Container and runtime proof

Keep the existing filtered `pnpm install --filter <app>...` steps. This
workspace disables ordinary dependency installation, while scaffold retains the
workspace definition. An unrestricted install would restore the runner disk
problem. [Scaffold](https://moonrepo.dev/docs/commands/docker/scaffold),
[2.6.4 setup](https://github.com/moonrepo/moon/blob/v2.6.4/crates/app/src/commands/docker/setup.rs#L15).

Production pruning has its own install path and is not disabled by
`javascript.installDependencies: false`. Preserve pruning for API and React
Router. Next copies standalone output; Java copies a JAR into a JRE runtime.
[2.6.4 prune implementation](https://github.com/moonrepo/moon/blob/v2.6.4/crates/app/src/commands/docker/prune.rs#L131),
[prune defaults](https://github.com/moonrepo/moon/blob/v2.6.4/crates/config/src/workspace/docker_config.rs#L48).

The old shadow workflow built images with `load: false` and could not
demonstrate runtime behavior. The starter change adds
`scripts/check-compose.mjs` and ordinary hosted-runner CI to build and run all
four images. That check covers direct readiness, non-root users, Express
responses, a Spring item visible through React Router, Next-container access to
Express, and authentication redirects. It uses fixed local placeholder
configuration and performs no publication or hosted database operations.

The remaining canonical cutover should promote the proven Moon Dockerfiles to
`Dockerfile`, point publication and Compose at them, switch root commands,
replace the Turbo release adapter with full Moon builds, supersede ADR-0001, and
remove duplicate prototype artifacts. Remove Turbo-specific lint/generator
dependencies only after checking their consumers. Private remote cache
deployment remains optional.
