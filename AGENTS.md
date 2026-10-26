# AGENTS.md

This file configures how agent skills interact with this repository.

The role of this file is to describe common mistakes and confusion points that agents might encounter as they work in this project. If you ever encounter something in the project that surprises you, please alert the developer working with you and indicate that this is the case in the AGENTS.md file to help prevent future agents from having the same issues.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/<feature>/`, with optional publishing to GitHub Issues when needed. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context monorepo — `CONTEXT-MAP.md` at root points to per-app `CONTEXT.md` files. See `docs/agents/domain.md`.

## Surprises / Confusion Points

- TypeScript aliases retain their package `bin` names: `typescript7: npm:typescript@7.0.2` provides `tsc`, while `typescript: npm:@typescript/typescript6@6.0.2` provides `tsc6` and the legacy API. ESLint 10's React plugin peer exception requires wrapping the actual recommended config with `@eslint/compat`.
- Frontend tooling requires Node `^24.15.0 || >=26.0.0` because jsdom 30 has a stricter minimum than the frameworks. Keep frontend engine declarations, Node types, CI, and Docker runtime lines aligned; the older Node 20 configuration was not sufficient.
- When upgrading `@supabase/ssr` to 0.12.7, its `setAll(cookies, headers)` callback supplies cache headers that must accompany auth-cookie writes. Callbacks that accept only cookies remain type-compatible while silently dropping the headers. Preserve response/redirect propagation, including multiple writes where the headers arrive only on the first write.
- Docker tool installs must read the root package manager pin and include `$PNPM_HOME/bin` in `PATH`; pnpm 12 places global executables there and fails with `ERR_PNPM_GLOBAL_BIN_DIR_NOT_IN_PATH` when only `$PNPM_HOME` is present. Container builds use full task builds, exclude `.git`, and do not require a Git bind mount.
- Frontend image builds need the public Supabase URL and anon key passed by the deployment workflow and allowed through Turbo's build environment list; declaring Docker build arguments alone does not make them available to Next.js or Vite under Turbo's strict environment mode.
- pnpm settings such as `packageExtensions` belong in `pnpm-workspace.yaml`; pnpm 10 ignores the legacy root `package.json#pnpm` field.
- The current Turbo-based `apps/api/Dockerfile` runs `pnpm i -g turbo` before copying the root `package.json`, so Corepack cannot see the repository's pinned pnpm version. As of 2026-08-12 it selects pnpm 11 on Node 20 and fails on the missing `node:sqlite` built-in. Docker setup steps must activate or expose the repository-pinned package manager before invoking pnpm.
- `apps/java-api/src/main/resources/application.properties` configures the actuator base path as `/actutaor` (misspelled), so the current container health endpoint is `/actutaor/health`, not `/actuator/health`.
- The Java `build` and `test` package scripts both begin with Maven `clean` and write `apps/java-api/target`; task runners must serialize them when both are requested or Maven can fail while deleting the shared output directory.
- `moon docker file <project>` writes to that project's existing `Dockerfile` when no destination is supplied; always pass an explicit prototype destination when comparing against a current Dockerfile.
- With Moon 2.4.6 and this repo's system-toolchain configuration, the default generated Dockerfile starts from `scratch` but still emits shell installation commands and uses the build task as `CMD`; treat it as a structural reference and maintain repo-specific runtime stages.
- Corepack in a Node Docker base may resolve a pnpm version incompatible with that Node version; Dockerfiles must explicitly activate the repository's pnpm version before invoking pnpm.
- Docker build contexts must exclude `.env` files recursively; frontend image builds receive Supabase/public configuration through explicit build arguments instead of copying the repo-root environment file.
- Moon 2.4.6 cannot cache `apps/web`'s complete Next.js standalone output on every runner because the pnpm symlink graph can trigger `task_runner::output::symlink_outside_workspace` after `next build` succeeds. Keep `web:build` non-cacheable rather than caching an incomplete subset of `.next/standalone`.
- Moon Docker scaffolds retain the workspace definition, so an unfiltered `pnpm install` materializes dependencies for every workspace and can exhaust ARC runner disk. In each `Dockerfile.moon`, install with `--filter <project>...` to include only the target and its workspace dependencies.
- React Router v8 prerendering starts a temporary Vite preview server. In the Node 24 container, leaving Vite's preview host implicit caused deterministic `ECONNREFUSED 127.0.0.1:<port>` failures; keep `apps/react-router-web/vite.config.ts#preview.host` pinned to `127.0.0.1` unless the container networking behavior is reverified.
- `AGENTS.md` refers agents to a "Wayfinding operations" section in `docs/agents/issue-tracker.md`, but that section is currently absent. Until it is documented, Wayfinder maps use the local Markdown tracker with explicit parent and `blocked_by` metadata/body links as the fallback relationship convention.
- React Router Playwright tests discover local Supabase credentials through `scripts/lib/supabase-local-env.mjs` and inject them into `react-router dev`. Keep that guarded path intact; local E2E must never fall back to potentially remote values from the repository-root `.env`.
- The shadcn registry ships each component in multiple base flavors (`radix`, `base`, `aria`), but there is **no** `base` field in `components.json` and no `--base` flag on `shadcn add` (verified against CLI 4.18.0). The flavor is encoded as a prefix of the `style` string (e.g. `base-nova` vs the legacy Radix `new-york`), and `init --base` only affects new projects. Existing configs keep their `style` forever, so an unqualified `shadcn add` here emits legacy Radix variants even after the migration to the base flavor starts. Before pulling components, set `style` to the desired flavor-prefixed value in all three `components.json` files (`packages/ui`, `apps/web`, `apps/react-router-web`) (see `.scratch/shadcn-registry-sync/findings/base-flavor-drift-audit.md`).
- The shared UI table exports had missing `lib/data-table`, `lib/parsers`, and `types/data-table` helpers, an undeclared `nuqs` dependency, and an app-only `@/lib/format` import. App type checks did not reach these unused exports; keep `@repo/ui`’s own type check in verification so shared exports are checked independently. Its Next-only breadcrumb hook requires the optional Next peer, while React Router consumers can use the other exports.
- Next.js 16.3+ writes managed agent instructions into `apps/web/AGENTS.md` during `next dev`. Keep `next.config.ts#agentRules` disabled to preserve this repository’s manually maintained instructions.
- With Vite 8, the React Router devtools adapter uses `@tanstack/devtools-vite` 0.8.5. Its default console piping can recursively echo forwarded browser errors; keep `consolePiping.enabled` false while retaining the devtools plugin. CSP nonces also need the client `NonceProvider` and explicit `Links nonce` so login pages hydrate consistently.

- pnpm 12 rejects unreviewed dependency builds and checks release ages even for existing lockfile entries. Keep explicit `allowBuilds` decisions and exact-version `minimumReleaseAgeExclude` entries in `pnpm-workspace.yaml`; do not disable the policies to make an upgrade install. CI uses `pnpm/action-setup@v6.1.0` because v4's embedded pnpm 8 installer fails on pnpm 12's native package.
- Vitest 5 defaults independent CLI processes to the same workspace `node_modules/.vitest-cache`; after a lockfile change, concurrent invalidation can fail with `ENOTEMPTY`. Keep each suite's `test.fsModuleCachePath` inside its own package when Turbo or Moon runs suites concurrently.
- Changesets CLI 3 requires the v2 release action integration: `publish-script`/`version-script` replace `publish`/`version`, and `github-token` replaces the token environment variable. Keep `push-with-git-cli: true` when preserving this repository's Git push behavior.
