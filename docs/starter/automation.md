# Optional automation

Repository CI runs against local containers on a GitHub-hosted runner. It uses
no production credentials.

Remote workflows are examples owned by the application that adopts this starter.
They remain disabled until their repository variable is enabled:

| Variable                           | Enables                                                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ENABLE_REMOTE_AUTOMATION=true`    | Manually dispatched container publication, database deployment, function deployment, and registry cleanup examples |
| `ENABLE_PACKAGE_PUBLISHING=true`   | Changesets release automation on main and release tags                                                             |
| `ENABLE_DEPENDABOT_AUTOMERGE=true` | Approval and auto-merge for eligible Dependabot updates                                                            |

Before enabling an integration, replace the custom runner label, configure its
secrets and target environment, and review the workflow's commands. A variable
enables jobs; it does not provision runners, secrets, databases, or environment
approval rules. Use GitHub environments to protect production operations.

Remote preview automation was removed because its migration job selected
production or staging credentials and reset that database. A future preview
integration must create a disposable database, obtain its actual connection
information, verify its identity, and migrate only that database. Production and
staging credentials must never be a preview fallback.

Database backups belong in access-controlled backup storage or the database
provider's managed backup system. The former workflow that committed raw data
dumps into Git was removed. The generated-types schedule was also removed; CI
now checks types against the local migration-defined schema, rather than
treating a remote database as the source of truth.

Function test workflows previously referenced a missing `deno-test.ts`. Add
actual function tests and a pinned Deno runner when adopting the edge-function
example. The database and application checks have been consolidated into Starter
CI.
