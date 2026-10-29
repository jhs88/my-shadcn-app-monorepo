# React monorepo starter

A reusable starter with Next.js and React Router examples, shared shadcn/ui
components, Supabase authentication, and optional Express and Spring Boot APIs.

Start with the React Router private-project example. It includes login,
server-side validation, create/edit/delete, and database ownership policies. The
other apps are independent examples you can keep or remove.

## Start locally

Install Node **24.22.1**, pnpm **12.15.0**, Docker, and the
[Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
CI uses Supabase CLI **2.122.0**. Java is needed only for the Spring example and
full workspace verification.

```bash
corepack enable
corepack install
pnpm install --frozen-lockfile
pnpm setup:local
pnpm dev:starter
```

Open <http://127.0.0.1:5173/login>. Sign in with the local demo account:

- Email: `playwright@example.com`
- Password: `playwright-password-123`

Choose **Your projects** to create, edit, and delete a private project. You can
also register your own local account. The setup command starts local Supabase,
applies pending migrations, and prepares the demo account. It preserves existing
local database contents and does not overwrite environment files.

`dev:starter` discovers credentials from the local Supabase CLI and injects them
into the app process. You do not need cloud credentials, a root `.env`, or
`psql`. Local setup and browser tests reject hosted Supabase URLs. The fixed
demo password is for local development only.

Stop the app with Ctrl+C. Stop its database with `supabase stop`, which
preserves local data.

## Choose your apps

| App                | Purpose                                          | Development command          |
| ------------------ | ------------------------------------------------ | ---------------------------- |
| `react-router-web` | Canonical private-project example                | `pnpm dev:starter`           |
| `web`              | Next.js auth, server actions, and TanStack Query | `pnpm dev:next`              |
| `api`              | Minimal Express API                              | `pnpm --filter api dev`      |
| `java-api`         | Spring Boot Item CRUD example                    | `pnpm --filter java-api dev` |

The Next.js example runs at <http://localhost:3000>. Its greeting form calls
Express at port 3001. Build `@repo/logger` before starting Express with
`pnpm --filter @repo/logger build`. Install JDK 21 for the Spring example.

Use `pnpm dev` only when you want every workspace development task. To adapt
this starter, follow [Choose and trim a stack](docs/starter/adapting.md).
[CONTEXT-MAP.md](CONTEXT-MAP.md) describes each app and shared package.

## Use Git hooks

`pnpm install` configures Husky hooks for your local clone:

- Before a commit, lint-staged formats staged `.ts` and `.tsx` files with
  Prettier and stages the formatting changes. Unstaged edits stay unstaged.
- Before a push, `pnpm lint` and `pnpm check-types` check all workspaces through
  Turbo. A failed check stops the push. These tasks can build workspace
  dependencies and reuse cached results.

If hooks are missing after an install that reports everything is up to date,
run `pnpm prepare`. pnpm can skip lifecycle scripts on an unchanged install.

To run the push checks without pushing, run `sh .husky/pre-push` from the
repository root. Fix reported errors and retry the commit or push.

Starter CI disables Husky with `HUSKY=0` and runs lint through its verification
commands on pull requests and pushes to `main`. Application and Docker build
commands do not invoke lint. Docker builds exclude `.git` and `.husky`; Husky
skips hook installation without Git metadata. To bypass hooks for one command,
use `HUSKY=0 git commit ...` or `HUSKY=0 git push ...`.

## Verify a change

After `pnpm setup:local`, run these commands with JDK 21 installed:

```bash
pnpm verify:local
supabase test db
pnpm --filter react-router-web exec playwright install chromium
pnpm test:react-router-web:e2e
```

`verify:local` supplies local Supabase configuration to workspace lint, types,
unit tests, and production builds. Browser tests cover login/logout, the
component gallery across six themes, and private-project CRUD. SQL tests
exercise two-user isolation and avatar write policies.

Generate database types from the local migrations with `pnpm db:types`. Commit
migrations and the regenerated `packages/types/database.types.ts` together. Keep
schema and policies in `supabase/migrations`; reserve `supabase/seed.sql` for
optional sample data.

## Run containers

Containers are optional. Build from the repository root with your own Supabase
URL and public anon key. [.env.example](.env.example) lists the configuration
names. A browser must reach the public URL, and the frontend containers must
reach that same Supabase instance.

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

For local Supabase, use a hostname reachable from both the browser and
containers, or configure separate server/browser endpoints before using auth.
The native `dev:starter` path handles local auth automatically. The four-service
Compose example demonstrates frontend/backend connectivity independently of
hosted auth.

Compose exposes Next.js on 3000, Express on 3001, React Router on 8080, and
Spring on 8081. Run `pnpm test:containers` for an isolated four-service
readiness and connectivity check that cleans up its own containers. Container
builds use the Moon Dockerfiles. Root workspace commands still use Turbo while
the migration proof is completed. See
[Moon completion plan](docs/starter/moon-migration.md).

## Automation

[Starter CI](.github/workflows/ci.yml) runs on standard GitHub-hosted runners
and needs no repository secrets or private cache. It checks database policies,
generated types, Turbo and Moon workspace verification, browser journeys, and
the four-service container runtime.

Remote deployment examples are manual and require
`ENABLE_REMOTE_AUTOMATION=true` as a repository variable. Package publishing
requires `ENABLE_PACKAGE_PUBLISHING=true`; Dependabot auto-merge requires
`ENABLE_DEPENDABOT_AUTOMERGE=true`. These are optional integrations. The starter
has no PR-triggered remote database reset and never commits database backups to
Git.

See [Optional automation](docs/starter/automation.md) before enabling these
workflows.

## Shared UI

Both frontends import components from `@repo/ui`. Run the shadcn CLI from the
repository root:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

The shared configuration uses the Base UI flavor. Keep all three
`components.json` style settings aligned. Import components with paths such as
`@repo/ui/components/button`.
