# React Router v8 compatibility baseline

Research date: 2026-07-31

## Recommendation

Use this exact implementation baseline:

| Component | Recommended version | Compatibility decision |
| --- | ---: | --- |
| Node.js runtime | `24.18.0` LTS | Set package `engines.node` to `>=22.22.0`. Node 24 is the preferred production/CI line; test the minimum once on Node `22.22.x`. Node 20 is EOL and cannot run React Router v8. |
| React / React DOM | `19.2.8` | Already installed and above the v8 minimum of `19.2.7`. Keep both aligned. |
| React Router staging release | `7.18.2` | Move every `react-router` and `@react-router/*` package from `7.18.1` to the latest v7 first, adopt all v8 flags, then move to v8. |
| React Router target | `8.3.0` | Pin `react-router`, `@react-router/dev`, `@react-router/node`, `@react-router/serve`, and `@react-router/fs-routes` to the same exact version. Their peer dependencies require alignment. |
| Vite | `7.3.6` | The lowest-risk supported major. React Router v8 accepts Vite 7 or 8, but selecting Vite 8 would add a second major migration and Rolldown-specific changes. |
| Sentry React Router | `10.69.0` | Sentry `9.15.0` accepts only React Router 7; `10.61.0` is the first release declaring React Router 8 support, and `10.69.0` is current. |
| Tailwind Vite / Tailwind CSS | `4.3.3` | Keep `@tailwindcss/vite` and `tailwindcss` aligned. The resolved `@tailwindcss/vite@4.1.8` accepts only Vite 5/6; `4.3.3` accepts Vite 5.2 through 8. |
| Vitest / Vitest UI | `4.1.10` | Align the app with the repo-root Vitest version and keep `@vitest/ui` exact. It accepts Vite 6/7/8 and Node 20/22/24+. This is compatible, not a React Router hard requirement. |
| React Router DevTools | `6.2.3` | Version 5 imports the removed `vite-node` under Vitest 4. Version 6.2.3 removes that startup blocker and passes this app's test, development, build, and prerender checks. |

Version records: [React Router 8.3.0](https://www.npmjs.com/package/react-router/v/8.3.0), [Vite 7.3.6](https://www.npmjs.com/package/vite/v/7.3.6), [Sentry React Router 10.69.0](https://www.npmjs.com/package/@sentry/react-router/v/10.69.0), [Tailwind Vite 4.3.3](https://www.npmjs.com/package/@tailwindcss/vite/v/4.3.3), [Vitest 4.1.10](https://www.npmjs.com/package/vitest/v/4.1.10), and [React Router DevTools 6.2.3](https://www.npmjs.com/package/react-router-devtools/v/6.2.3).

## Hard migration constraints

React Router's official sequence is important: update all Router packages to the latest v7, enable and validate every v8 future behavior independently, make the call-site migrations, and only then install v8. The latest v7 published at the research date is `7.18.2`. The active flags are:

- `future.v8_middleware`
- `future.v8_splitRouteModules`
- `future.v8_viteEnvironmentApi`
- `future.v8_passThroughRequests`
- `future.v8_trailingSlashAwareDataRequests`

In v8 these flags are removed and their behavior is unconditional. `v8_splitRouteModules` becomes the top-level `splitRouteModules` option and defaults to `true`; it can be disabled or set to `"enforce"`. The Environment API is always enabled. The raw incoming request is always passed to loaders/actions/middleware, while their sibling `url` argument is the normalized URL without Router-specific `.data`, `index`, or `_routes` details. Trailing-slash data requests use `/_.data`, including the root request. Any proxy, cache, rewrite, rate-limit, logging, or observability rule that recognizes `.data` URLs must be tested. [Official v7-to-v8 guide](https://reactrouter.com/upgrading/v7) and [v8 changelog](https://reactrouter.com/home/changelog#v800).

React Router v8 is ESM-only and targets ES2022. This app is already an ESM package and its Vite build target is already `es2022`, but every direct Node entry, dynamic import, custom Vite plugin, and production build must still be exercised. The framework minimums are Node `22.22.0`, React/DOM `19.2.7`, and Vite 7. React Router supports Active LTS Node lines and only the latest minor line of Maintenance LTS; it may raise the Maintenance-LTS minimum in a Router minor release. [React Router adapter support policy](https://reactrouter.com/api/other-api/adapter#node-version-support) and [Node release status](https://nodejs.org/en/about/previous-releases).

React Router v8 removes the deprecated `AppLoadContext` export. Middleware is always on and `context` is always a `RouterContextProvider`. In this repository, the obsolete fifth document-handler argument is removed, while route middleware creates typed context values directly. [v8 breaking-change notes](https://reactrouter.com/home/changelog#v800) and [v8 `RouterContextProvider`](https://api.reactrouter.com/v8/classes/react-router.RouterContextProvider.html).

Also audit and replace removed `data` properties with `loaderData` in `meta` args, meta matches, component matches, and `useMatches()` results. Remove any `react-router-dom` dependency/import: normal DOM APIs move to `react-router`, while `RouterProvider` and `HydratedRouter` come from `react-router/dom`. The current repository search did not show a direct `react-router-dom` dependency in this app, but transitive consumers still need lockfile validation. [Official v7-to-v8 guide](https://reactrouter.com/upgrading/v7#other-breaking-changes).

## Package-specific findings

### Vite and the framework server

`@react-router/dev@8.3.0` declares Vite `^7.0.0 || ^8.0.0`; Vite `7.3.6` requires Node `^20.19.0 || >=22.12.0`, so the stricter Router minimum governs. Enable `future.v8_viteEnvironmentApi` while still on Router v7/Vite 6, then update Vite. Configuration that varies on `isSsrBuild` must move under per-environment configuration. This app's current Vite config does not branch on `isSsrBuild`, but plugin ordering, `react-router dev`, the `react-router-serve` production build, `buildEnd`, and prerender all require runtime tests. [React Router environment migration](https://reactrouter.com/upgrading/v7#futurev8_viteenvironmentapi) and [Vite Environment API](https://vite.dev/guide/api-environment).

### Sentry

`@sentry/react-router@9.15.0` declares only `react-router: 7.x` and `@react-router/node: 7.x`; it is not a valid v8 baseline. Sentry `10.61.0` introduced the `7.x || ^8.x` peers, and the current `10.69.0` retains them. The currently used exports `sentryReactRouter`, `sentryOnBuildEnd`, and `SentryReactRouterBuildOptions` remain present in the 10.69.0 published type surface, but production build/source-map upload and client capture must be verified. [Sentry 10.61.0 release](https://github.com/getsentry/sentry-javascript/releases/tag/10.61.0) and [10.69.0 React Router package metadata](https://github.com/getsentry/sentry-javascript/blob/10.69.0/packages/react-router/package.json).

There is a pre-existing Sentry concern independent of Router v8: `apps/react-router-web/index.js` installs `source-map-support`, while Sentry's official source-map guidance says not to use `source-map-support` when uploading source maps because it rewrites stack traces before Sentry can process them. Since this app configures Sentry source-map upload, decide whether to remove that runtime hook and verify server stack traces. [Sentry source-map troubleshooting](https://docs.sentry.io/platforms/javascript/guides/hono/sourcemaps/troubleshooting_js).

### Tailwind Vite

The resolved `@tailwindcss/vite@4.1.8` has a Vite `^5.2 || ^6` peer, so it cannot remain with Vite 7. `@tailwindcss/vite@4.1.18` is the first currently relevant version verified to add Vite 7 to that range; current `4.3.3` accepts Vite 5.2, 6, 7, and 8 and pins its internal Tailwind packages to `4.3.3`. Align the app's direct `tailwindcss` dependency to `4.3.3` to avoid two Tailwind versions. Its integration shape remains `tailwindcss()` in Vite plugins. [Official Tailwind Vite setup](https://tailwindcss.com/docs/installation/using-vite) and [4.3.3 package metadata](https://www.npmjs.com/package/@tailwindcss/vite/v/4.3.3).

### Vitest

Vitest `3.2.7` is technically compatible with Vite 7, so a Vitest major update is not required by Router v8. The repo root already uses `vitest`, `@vitest/coverage-v8`, and app-independent tests at `4.1.10`; aligning this app's `vitest` and `@vitest/ui` to exact `4.1.10` removes mixed toolchains. Vitest 4 requires Vite 6+ and Node 20+, both weaker than the chosen baseline, but has breaking changes in coverage, reporters, deprecated options, snapshots, and its switch from `vite-node` to Vite's Module Runner. This app's tests appear to use standard test APIs, but run them all and review snapshots/configuration. [Official Vitest 4 migration guide](https://vitest.dev/guide/migration#vitest-4).

### React Router DevTools

The installed `react-router-devtools@5.0.6` declares React Router `>=7.0.0`, Vite `>=5.0.0`, React `>=17`, and requires an ESM Vite project. Those ranges include the proposed baseline. However, its maintainer documentation says only “React Router 7.0 or higher”; it does not publish an explicit tested-version matrix for Router 8. Keeping 5.0.6 minimizes unrelated change. If it causes Vite Environment API, typegen, build, or prerender failures, temporarily remove the plugin to prove causality, then evaluate current `6.2.3` separately. [Maintainer prerequisites](https://react-router-devtools.forge42.dev/home) and [6.2.3 package metadata](https://www.npmjs.com/package/react-router-devtools/v/6.2.3).

That failure occurred during implementation: version 5 imported `vite-node`, which Vitest 4 no longer provides. Upgrading DevTools to 6.2.3 fixed the test startup and passed dev/build/prerender verification. Its transitive WASM tooling caused pnpm to choose alpha `@emnapi` packages for Knip's optional peers, so the root manifest provides the previously locked compatible stable versions (`@emnapi/core@1.9.1` and `@emnapi/runtime@1.11.2`) explicitly; the final frozen install then reports no peer incompatibilities.

## Required validation gates

1. On Router `7.18.2`, enable one v8 flag at a time and run typegen, typecheck, unit tests, production build, and focused browser tests before the next flag.
2. Verify raw `request.url` versus normalized `url`, root `/_.data`, trailing-slash `/_.data`, redirects, rate limits, auth callbacks, health checks, logging, and Sentry transaction naming.
3. Verify prerendering of `/` because v8 permanently replaces the old prerender flow with the Vite preview-server flow; `8.1.0` also fixed a `buildEnd` ordering regression, which is another reason to target current `8.3.0` rather than `8.0.x`. [React Router v8 release history](https://reactrouter.com/home/changelog).
4. Run `pnpm` peer-dependency inspection after install. There must be one aligned Router v8 version, Sentry must resolve against Router v8, Tailwind's plugin must accept Vite 7, and Vitest UI must exactly match Vitest.
5. Run CI/deployment checks on an LTS runtime. The repo's release workflow still names Node 20 and must be updated; the React Router app Dockerfile already uses Node 24, which is supported. Do not treat the local Node 26 Current runtime as the sole compatibility proof.

## Uncertainty

- Package versions and peer ranges were checked against their published registry metadata on the research date; a future install using ranges may select newer releases. Exact pins make this baseline reproducible.
- React Router DevTools has a broad compatible peer range but no explicit public Router-v8 test matrix. Its compatibility must be proven by this app's dev/build/prerender checks.
- Sentry's package metadata and exported types prove declared/API compatibility, not that this app's build-end/source-map/browser-monitoring combination works under every environment. A production-mode build without uploading credentials, followed by a credentialed staging build, is required.
- Node 24.18.0 is the recommended LTS runtime, while React Router's package engine deliberately permits `>=22.22.0`. React Router only officially promises Active LTS and the latest Maintenance-LTS minor line, so avoid relying on Node 26 Current for production support.
