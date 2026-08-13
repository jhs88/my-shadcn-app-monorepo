# Moon CI shadow prototype

This is a throwaway CI probe on `prototype/moon-migration`, not the final CI
contract and not a required check.

It answers two additive-migration questions:

1. Can the pinned moon 2.4.6 configuration execute the repository's complete
   verification graph on the existing CI runner and emit an understandable
   affected-task report?
2. Can all four side-by-side `Dockerfile.moon` paths build without publishing,
   while the production Docker and deployment seams remain unchanged?

The workflow runs both probes even when one fails, publishes their outcomes to
the job summary, and uploads moon's JSON reports for inspection. Its push
trigger is intentional: GitHub cannot reliably dispatch a workflow that exists
only on a non-default branch until that workflow has first been registered.

## Important prototype correction

The initial moon configuration inherited `$CI` as a workspace-wide input from
Turbo. moon considers a configured, non-empty environment input affected, and
GitHub Actions always sets `CI=true`. Keeping that input would therefore make
every task affected on every CI run and invalidate the selection experiment.
The prototype removes `$CI` from `implicitInputs`; the process environment still
contains `CI=true` for tools that alter behavior under CI.

## Deferred deliberately

- Branch-protection and required-check changes
- The permanent workflow topology and check names
- Dependabot-specific behavior
- Promotion thresholds and the representative-change matrix
- Remote-cache configuration
- Deployment and replacement of the production Dockerfiles
