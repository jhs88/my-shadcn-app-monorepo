# moon Migration Prototype Verdict

**Branch:** `prototype/moon-migration`

**Baseline:** `23ea56d3f00ca93c8db75d864a82dfe633890a7c` (`origin/main`)

**moon version:** `2.4.6`

## Verdict

moon is viable as an additive orchestrator for this repository, but this branch
is not a production cutover. It keeps pnpm, every existing package script,
Turbo, Dockerfiles, workflows, and release commands unchanged. The prototype
should remain side-by-side until Docker pruning, affected-release semantics,
Java provisioning, and remote caching are proven.

The strongest reason to continue is not raw speed. It is moon's explicit
project/task model, first-class affected CI, project metadata, and ability to
model the Java and JavaScript applications in one graph.

## What the branch demonstrates

- Discovers exactly 10 pnpm workspace projects from `apps/*` and `packages/*`.
- Infers only scripts that each project actually exposes, avoiding the Turborepo
  migration extension's broad task inheritance.
- Infers workspace dependencies, including `api -> logger`, and maps Turbo's
  upstream build ordering to `^:build`.
- Makes `api:lint` and `api:test` depend on `logger:build`, fixing the clean
  checkout dependency that the existing Turbo graph omits.
- Adds stack/layer/tag metadata without moving source files.
- Preserves Turbo's relevant build inputs, environment inputs, outputs, and
  long-running task behavior.
- Narrows broad Turbo output globs to artifacts each project actually creates,
  because moon validates declared outputs after successful tasks.
- Hashes the frontend public/runtime build variables actually referenced by the
  Next.js and React Router applications, including public Supabase and Sentry
  build settings.
- Provides opt-in `pnpm moon:*` scripts while leaving all established root
  scripts Turbo-backed.
- Demonstrates local cache reuse: a repeated lint run restored all six lint
  targets from moon's cache and completed in 62 ms on this machine.
- Exposes affected traversal as explicit `--upstream` and `--downstream` depth
  controls.

## Runtime evidence

| Check                   | Result              | Evidence                                                                                                    |
| ----------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Workspace graph         | Pass                | 10 projects, 42 tasks, 5 build targets, 6 lint targets                                                      |
| `moon run :lint`        | Pass                | Six applicable projects completed; existing warnings remained warnings                                      |
| Repeated lint           | Pass                | Six cache hits; 62 ms total                                                                                 |
| `moon run :check-types` | Pass                | `web` and `react-router-web` completed                                                                      |
| Unit tests              | Partial             | `logger` 1/1, `api` 2/2, `web` 9/9 pass                                                                     |
| React Router tests      | Existing failure    | Vitest also collects Playwright specs; Turbo reproduces the same two failed suites and 10 passing tests     |
| Non-Java builds         | Partial             | `logger`, `api`, and `react-router-web` pass through moon                                                   |
| Next.js build           | Existing failure    | `/protected` imports a `"use server"` module exporting a non-async value; Turbo reproduces the same failure |
| Java test/build         | Environment blocked | No JDK or valid `JAVA_HOME` is installed on this host; moon does invoke the existing Maven-wrapper script   |
| Turbo availability      | Pass                | Existing Turbo commands/configuration remain present and were used for failure parity checks                |

The final Turbo-backed `pnpm verify` was run. Its lint and check-types phases
passed, then `java-api:test` stopped the test phase because this host has no
valid `JAVA_HOME`; Turbo cancelled the sibling test processes. This is the same
host boundary reached by `moon run :test`, so the final regression gate is
explicitly **baseline-blocked**, not passed.

## Task-selection comparison

moon 2.4.6 has no `run --dry-run`; the comparison used Turbo's JSON dry-run and
moon's resolved task graph. Turbo emits `<NONEXISTENT>` placeholders for every
workspace package, while moon omits projects that do not expose the script.

| Task        | Turbo runnable targets                                      | moon targets                                  | Difference                        |
| ----------- | ----------------------------------------------------------- | --------------------------------------------- | --------------------------------- |
| build       | logger, api, java-api, react-router-web, web                | logger, api, java-api, react-router-web, web  | Same executable surface           |
| lint        | logger, types, ui, api, react-router-web, web               | logger, types, ui, api, react-router-web, web | Same executable surface           |
| test        | logger, api, java-api, react-router-web, web                | logger, api, java-api, react-router-web, web  | Same executable surface           |
| check-types | logger:build, react-router-web:check-types, web:check-types | react-router-web:check-types, web:check-types | moon omits unrelated logger build |

Turbo additionally listed nonexistent placeholders for all ten projects in each
requested task. moon resolved only real package scripts; a validator checked all
42 moon tasks and found zero absent-script invocations.

A forced `pnpm install --frozen-lockfile` was needed during the prototype
because the checkout initially contained a stale
`apps/api/node_modules/typescript` symlink. That was local installation state,
not a tracked repository change. After relinking, `api` also required the
existing `logger` build output; moon's `api:build` graph handles this through
`api -> logger`. The prototype also applies that dependency to `api:lint` and
`api:test`, so those checks do not depend on stale local build output.

## Configuration approach

- `.moon/workspace.yml` discovers both project roots and configures `main` as
  the VCS base.
- `.moon/toolchains.yml` uses the repository's installed Node and pnpm instead
  of introducing an arbitrary new version policy.
- Package scripts remain the public execution seam. moon calls
  `pnpm run <script>`.
- Project `moon.yml` files exist only where task graph details or metadata are
  needed.
- Global environment inputs are inherited without inventing tasks on projects
  that do not provide them.
- Normal `test` scripts intentionally have no `coverage/**/*` output because
  they run plain Jest/Vitest and do not create that directory. Turbo's global
  declaration is broader than the commands' behavior; only the explicit
  `web:coverage` task declares a coverage artifact.

## Gaps before a real migration

1. **Fix or explicitly exclude Playwright specs from the React Router Vitest
   configuration.** This is an existing test-suite issue, but `moon:test` cannot
   be a green cutover gate until it is resolved.
2. **Fix the existing Next.js production build failure.** moon and Turbo both
   fail on the same application error.
3. **Provision and pin a JDK, then run the Maven-backed Java build and tests.**
   Do not infer success from graph construction.
4. **Prototype all four Dockerfiles.** Replace each `turbo prune --docker` path
   with moon's scaffold/setup/prune flow and compare image contents and runtime
   behavior.
5. **Choose affected traversal deliberately.** Compare Turbo release selection
   with `moon ci` using explicit upstream/downstream policies and full Git
   history.
6. **Choose a remote cache.** Turbo and moon cache protocols are incompatible;
   existing remote artifacts do not migrate.
7. **Add a separate, non-blocking CI job first.** Do not replace the current
   workflow until output and affected-selection parity are measured.
8. **Supersede ADR 0001 only after the pilot passes.** This branch intentionally
   does not rewrite the architecture decision.

## Suggested next slice

Use this branch as the base for a CI-only experiment:

1. install a pinned JDK in CI;
2. run `pnpm install --frozen-lockfile`, because this prototype deliberately
   configures moon not to install dependencies itself;
3. add a non-required `moon ci :lint :check-types :test :build` job with full
   Git history;
4. capture its selected targets and compare them with Turbo;
5. prototype one Docker image, preferably `apps/api`, before touching the other
   three;
6. decide whether the operational gains justify a full migration.

## API Docker prototype

The API Dockerfile now exercises moon's documented multi-stage integration:
`docker scaffold api`, a focused pnpm install, `moon run api:build`, then
`docker prune`. The explicit pnpm install is required because the workspace
deliberately configures moon with `javascript.installDependencies: false`.
It remains prototype evidence until its clean image build,
runtime health endpoint, dependency closure, image contents, and comparison to
the Turbo-built baseline have been recorded on the Wayfinder ticket.

The same pattern has now been adapted to all four images. React Router retains
focused production dependencies, Next.js retains standalone output, and Java
copies Temurin 21 into the moon build stage while keeping the JRE-only runtime.
Local Compose and the GHCR publication workflow no longer pass Turbo cache
arguments or secrets to the converted Dockerfiles.
