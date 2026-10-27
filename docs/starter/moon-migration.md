# Complete the Moon migration

Moon 2.6.4 already has project configuration and Dockerfiles for all four
services. The remaining migration is a consistency and evidence task. This
starter PR prepares the checks and repairs cache inputs; it preserves the
root-command default. It does not require another orchestrator prototype or a
mandatory private cache.

The current support boundary is explicit: root workspace commands and
publication use Turbo. Local Compose uses Moon Dockerfiles. The private cache
and shadow workflow are optional infrastructure examples. A successful image
build alone does not establish runtime parity or a completed cutover.

Local evidence from this change: the 20-task Moon verification passed on JDK 21;
changing shared UI source changed the React Router build hash; all four Moon
images started as healthy non-root processes; both frontend/backend contracts
and unauthenticated redirects passed. A browser also submitted the Next greeting
form successfully against Express. Hosted CI repeats workspace and container
verification. Affected-selection proof and the atomic default switch remain
cutover work.

## Completion gates

1. Keep the explicit shared-source and root-policy cache inputs added by this
   work. Run `pnpm moon:verify` on JDK 21 with local Supabase configuration,
   covering the same workspaces as `pnpm verify:local`. Preserve Java build/test
   serialization and the shared UI's independent typecheck.
2. Run `pnpm test:containers` to build all four Moon images in clean CI, start
   them together, and check direct readiness, non-root execution,
   Next-to-Express behavior, and React-Router-to-Spring behavior. Use local fake
   public configuration for public-route probes, and local Supabase for
   authenticated checks.
3. Check affected selection for app-only, shared-UI, logger, schema/types, and
   root configuration changes. Include downstream consumers of shared packages.
   Treat publication as a separate contract; Changesets must still build every
   package it publishes.
4. Choose one canonical build path. Switch root scripts, Dockerfiles, Compose,
   CI, and the release build command together. Supersede ADR-0001 in that same
   change and remove duplicate prototype files after the replacement passes.
5. Run the final PR checks on GitHub-hosted runners before merging the cutover.
   Keep remote caching optional. Preserve complete Next.js standalone output
   with caching disabled unless the Moon symlink limitation is independently
   reverified.

The first cutover can build all publishable packages rather than copying Turbo's
affected-release optimization. Correct releases matter more than that
optimization in a small starter. Remote cache deployment and immutable release
publication are separate operational work and are not prerequisites for local
Moon use.

See [the source-backed cutover assessment](../research/moon-starter-cutover.md)
for current command semantics, task-graph concerns, and the recommended
sequence. Historical prototype documents retain their original evidence and are
not the current setup guide.
