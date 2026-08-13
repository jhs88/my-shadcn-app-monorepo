# Moon 2.4.6 remote cache on ARC

## Conclusion

For this repository's pinned `@moonrepo/cli` 2.4.6, the minimal unauthenticated
configuration is to expose the verified endpoint to the Moon process:

```yaml
env:
  MOON_REMOTE_HOST: grpc://172.16.8.179:9092
```

No committed `remote` block is required. Moon documents
`MOON_REMOTE_HOST` as an override for `remote.host`, and a non-empty host enables
the remote backend. The `grpc://` scheme selects the Bazel Remote Execution v2
gRPC client, whose server must provide action-cache and content-addressable
storage operations with SHA-256 digests. Moon's default cache mode is
read-write, so a cold CI run downloads if possible and uploads misses without an
additional flag. [Remote-cache guide](https://moonrepo.dev/docs/guides/remote-cache),
[environment overrides](https://moonrepo.dev/docs/env-vars#remote-caching),
[2.4.6 configuration source](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/config/src/workspace/remote_config.rs#L155-L190)

This is Moon's task-output cache, not Buildx's layer cache. A Moon artifact
contains a task's declared outputs and its stdout/stderr and is keyed by Moon's
task hash. It does not store repository source code. [Remote-cache FAQ](https://moonrepo.dev/docs/guides/remote-cache#faq)

## Configuration and authentication

- `MOON_REMOTE_HOST=grpc://172.16.8.179:9092` is sufficient for the currently
  verified unauthenticated endpoint. `remote.api` defaults to `grpc`; the URL's
  `grpc://` scheme is therefore consistent with the default. Do not enable
  `zstd` unless the service supports it. Uncompressed transfer is Moon's
  default. The default cache instance is `moon-outputs`; setting a stable,
  repository-specific `MOON_REMOTE_CACHE_INSTANCE_NAME` is optional but useful
  if the same server will serve multiple repositories. [Workspace remote
  settings](https://moonrepo.dev/docs/config/workspace#remote)
- The cache operation mode is `read-write` by default. `MOON_CACHE=write` can
  deliberately seed without accepting hits, while `MOON_CACHE=read` can prove
  retrieval without mutating the service. Normal shadow CI should use the
  default; those modes are useful for a controlled two-run experiment.
  [Command cache modes](https://moonrepo.dev/docs/commands/overview#caching)
- For bearer authentication, configure `remote.auth.token` to the **name** of a
  secret environment variable, not its value. The equivalent override is
  `MOON_REMOTE_AUTH_TOKEN=<SECRET_VARIABLE_NAME>` and that named variable must
  also exist in the job. Moon then sends `Authorization: Bearer <value>` and
  marks the header sensitive. If the configured token variable is absent or
  empty, the remote backend is not authorized/usable; therefore inject the
  token through GitHub Actions secrets and never write its value into YAML or
  logs. [Auth configuration](https://moonrepo.dev/docs/config/workspace#token),
  [2.4.6 header construction](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/cache-remote/src/headers.rs#L7-L48)
- Static/custom headers are supported under `remote.auth.headers`, including
  environment substitution, but there is no general environment override for
  the header map. Bearer auth is the cleaner secret-backed workflow seam.
  `grpcs://`, TLS, and mTLS configuration are also supported, although Moon's
  guide characterizes TLS/mTLS support as rudimentary and unstable. The supplied
  `grpc://` endpoint is plaintext and needs no certificate configuration.
  [Remote-cache TLS and mTLS](https://moonrepo.dev/docs/guides/remote-cache#tls-and-mtls)

## CI behavior

Remote caching works with both `moon run` and `moon ci`; it is not activated by
the `CI` variable itself. A configured host activates it, and ordinary cacheable
tasks participate automatically. Tasks with `options.cache: false` cannot
produce remote evidence; `local` and `remote` task cache modes restrict where a
task may cache. [Task cache option](https://moonrepo.dev/docs/config/project#cache)

`remote.cache.localReadOnly` only suppresses uploads during local development;
Moon explicitly permits uploads in CI. It is therefore unnecessary for ARC,
though it can protect the service from developer writes if remote configuration
is later committed. [Workspace `localReadOnly`](https://moonrepo.dev/docs/config/workspace#localreadonly)

The service address is not `localhost` or `0.0.0.0`, which matters because Moon
2.4.6 disables a localhost remote endpoint in CI. ARC also needs direct network
reachability to `172.16.8.179:9092`; configuration cannot compensate for a pod
network-policy or routing failure. Set `MOON_DEBUG_REMOTE=1` only for a
diagnostic run: Moon documents it as exposing internal remote-cache errors and
being very verbose. [Debug environment variable](https://moonrepo.dev/docs/env-vars#debugging),
[2.4.6 gRPC CI guard](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/cache-remote/src/grpc_remote_storage.rs#L220-L236)

## Proving remote hydration rather than a local hit

Moon 2.4.6 has a first-class `CachedFromRemote` status. It serializes statuses
in kebab case, so report JSON records `cached-from-remote`, while terminal output
renders `cached from remote`. The task runner selects this status only when
hydration returns a storage manifest identified as remote. [2.4.6 action status](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/action/src/action.rs#L14-L33),
[2.4.6 remote-hydration assignment](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/task-runner/src/task_runner.rs#L839-L878),
[2.4.6 console rendering](https://github.com/moonrepo/moon/blob/5ec34aa3020694bbf353c69503a3740046782849/crates/console/src/reporter.rs#L115-L128)

A defensible ARC proof should preserve all of the following:

1. A cold run on one ephemeral runner, with no restored `.moon/cache`, using
   the same commit, Moon version, toolchain, lockfile, inputs, and relevant
   environment values as the later run. Its report should show the chosen task
   operations passed rather than came from remote, and the service should show
   writes.
2. A later workflow run on a demonstrably different fresh ARC pod, again with
   no Actions cache or persisted `.moon/cache`. Its task hashes must match the
   cold run and `.moon/cache/ciReport.json` or `runReport.json` must contain
   `cached-from-remote` for the relevant output-hydration operations. The
   corresponding task command should not execute.
3. Upload a copy of the report plus non-secret runner/pod identity and task-hash
   evidence as workflow artifacts. Moon warns that reports under `.moon/cache`
   may be overwritten or cleaned and should be copied elsewhere for persistence.
   [Moon CI reports](https://moonrepo.dev/docs/commands/ci#reports)

A plain `cached` status is insufficient: Moon may reuse already hydrated local
outputs or its local cache. Moon 2.4 also warms the local cache after a remote
hit, making subsequent calls on the same runner local hits. The separate fresh
ARC runner and explicit `cached-from-remote` report status are therefore both
important. [Moon 2.4 cache storage changes](https://moonrepo.dev/blog/moon-v2.4#new-cache-storage-apis)

During the repository probe, `MOON_CACHE_DIR` did not relocate `.moon/cache`
under the pinned 2.4.6 CLI even though the current environment-variable page
documents it. Do not use that variable as evidence of an isolated cache for
this prototype. The successful direct-runner isolation probe instead moved the
existing cache aside, restored it afterward, and observed `cached from remote`.

## Recommended shadow-workflow shape

Keep the endpoint at job or Moon-step scope in the non-required prototype
workflow, invoke the package-pinned binary, and preserve the existing reports:

```yaml
env:
  MOON_REMOTE_HOST: grpc://172.16.8.179:9092

steps:
  - name: Run affected Moon verification
    run: pnpm exec moon ci :lint :check-types :test :build
```

If authentication is later enabled, prefer a small committed workspace setting
that names the secret variable, for example `remote.auth.token:
MOON_REMOTE_CACHE_TOKEN`, coupled with
`MOON_REMOTE_CACHE_TOKEN: ${{ secrets.MOON_REMOTE_CACHE_TOKEN }}` in the
workflow. Do not set `MOON_REMOTE_AUTH_TOKEN` directly to the secret value: its
meaning is the token variable's **name**.

For the first live probe, enabling `MOON_DEBUG_REMOTE=1` can establish connection
and protocol errors. Remove it or make it manually opt-in after the seam works;
the report's `cached-from-remote` status is the durable success signal.
