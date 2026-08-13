# Delivery

The delivery context describes how the monorepo's four services become a verifiable running release.

## Language

**Immutable image**:
An OCI image identified by its registry digest. Tags are aliases and never establish artifact identity.
_Avoid_: Versioned image, fixed tag

**Publication**:
The durable recording of every service image digest and its source and build evidence in a release manifest.
_Avoid_: Push, tagging

**Release manifest**:
The immutable identity of a four-service release: one digest per service plus the deployment-configuration reference and compatibility metadata.
_Avoid_: Tag set, Compose file

**Release identity**:
The SHA-256 digest of a canonically serialized release manifest. A release name is a human-facing alias, not identity.
_Avoid_: Release tag, workflow run

**Carried-forward image**:
An unchanged service image inherited from a parent release with its original source and build evidence intact.
_Avoid_: Reused tag, skipped image

**Parent release**:
The single release manifest from which a non-genesis release directly inherits lineage and any carried-forward images.
_Avoid_: Previous tag, base version

**Rollback compatibility**:
The declared constraints governing whether a release can safely run against external state left by a later release.
_Avoid_: Rollback support, backwards compatibility

**Promotion**:
Advancing an unchanged release manifest between environments without rebuilding its images.
_Avoid_: Re-release, production build

**Release event**:
An immutable record of a lifecycle transition or attempted transition for a release or environment deployment.
_Avoid_: Status update, manifest update

**Operation identity**:
The immutable identifier that makes a publication, promotion, deployment, or reconciliation request safe to repeat with identical inputs.
_Avoid_: Workflow run ID, retry number

**Promotion eligibility**:
A derived judgment that a published release currently satisfies the evidence, availability, policy, and approval prerequisites for a target environment.
_Avoid_: Promoted status, release readiness

**Unverifiable deployment**:
A deployment whose workload may be running but whose required verification or durable evidence could not be completed.
_Avoid_: Successful deployment, evidence warning

**Rollback request**:
An instruction to restore a previously published release manifest. It is intent, not proof that restoration occurred.
_Avoid_: Rollback

**Automatic rollback**:
A policy-authorized restoration of the environment's immediately preceding verified release when its compatibility with current external state is established.
_Avoid_: Redeploy previous, automatic downgrade

**Restricted rollback**:
A rollback whose safety cannot be established mechanically and therefore requires explicit authorization and, when necessary, a compensating plan.
_Avoid_: Manual rollback, unsafe rollback

**Break-glass rollback**:
An incident-only restricted rollback using emergency authority to bypass designated procedural gates without bypassing artifact identity, runtime observation, or auditability.
_Avoid_: Force rollback, unaudited rollback

**Compensating plan**:
A version-controlled procedure that restores external-state compatibility before a restricted rollback can safely run an older release.
_Avoid_: Approval note, rollback waiver

**Unresolved incident**:
An environment state in which neither a verified release nor a completed rollback can currently be established and further automatic mutation is stopped.
_Avoid_: Failed deployment, unknown status

**Completed rollback**:
A rollback whose running service identities match the target release manifest and whose health and smoke verification passed.
_Avoid_: Redeploy, rollback command

**Runtime convergence**:
The point at which every expected service replica is running the target release identity, before stability and behavior have necessarily been proven.
_Avoid_: Completed deployment, completed rollback

**Stability window**:
A continuous observation interval during which runtime identity and required health remain unchanged and passing.
_Avoid_: Startup delay, health-check retry

**Rollback evidence**:
The durable record connecting a rollback request, target release manifest, observed runtime identities, and verification results.
_Avoid_: Deployment log

**Evidence identity**:
The SHA-256 digest of a canonically serialized evidence bundle whose signature and attachments make a lifecycle outcome independently verifiable.
_Avoid_: Artifact URL, workflow run

**Evidence index**:
A signed, rebuildable discovery view that maps delivery history to immutable content identities without becoming the authority for those records.
_Avoid_: Evidence database, artifact list

**Rollback window**:
The policy-defined set of successful releases whose complete artifact graph must remain runnable as rollback targets.
_Avoid_: Image retention period, release history

**Recoverable release**:
A published release whose complete signed artifact and evidence graph can currently be fetched and independently verified for deployment.
_Avoid_: Available tag, retained release

**Retention root**:
A release, operation, incident, environment state, or hold from which artifact reachability is calculated before garbage collection.
_Avoid_: Pinned tag, protected artifact

**Evidence hold**:
A signed instruction that suspends expiry and deletion for a delivery record and every artifact transitively required to verify it.
_Avoid_: Keep flag, legal tag

**Evidence tombstone**:
An immutable record that identifies a deliberately deleted artifact, the governing policy, authorization, and prior content identity.
_Avoid_: Deletion log, missing artifact

**Verification policy**:
The content-addressed rules defining required observations, check behavior, thresholds, stability, and outcome classification.
_Avoid_: Test script, deployment settings

**Conformance profile**:
A cumulative set of delivery-contract capabilities whose required scenarios must pass before an implementation may claim that level of conformance.
_Avoid_: Test suite, feature tier

**Conformance report**:
A signed record binding an implementation and specification version to replayable scenario outcomes and their evidence identities.
_Avoid_: Checklist, CI summary
