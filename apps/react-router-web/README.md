# React Router starter

Run commands from the repository root. Follow the
[root quickstart](../../README.md) to install dependencies, start local
Supabase, apply migrations, and create the local demo account.

```bash
pnpm setup:local
pnpm dev:starter
```

Open http://127.0.0.1:5173. The `/projects` route demonstrates authenticated
loading, validated mutations, and owner-scoped database access. `/test` shows
the authenticated account, and `/items` demonstrates the separate Spring API
contract.

```bash
pnpm --filter react-router-web check-types
pnpm --filter react-router-web test
pnpm test:react-router-web:e2e
```

Browser tests discover local Supabase credentials and bootstrap their local
account automatically. They run serially because sign-out revokes that shared
account's sessions.

Use `pnpm test:containers` at the root to verify the four-service Docker
runtime. App images require the monorepo root as their build context. See
[starter adaptation](../../docs/starter/adapting.md) and
[Moon completion gates](../../docs/starter/moon-migration.md) before removing
workspace packages or switching build orchestration.
