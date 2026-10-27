# Choose and trim a stack

Start with the smallest combination your next project needs. Keep
`react-router-web` for the private-project example or `web` for Next.js server
actions. Both consume `@repo/ui`; authentication uses Supabase directly, so
neither needs a separate backend for auth.

1. Keep your chosen frontend under `apps/`.
2. Keep Express if you need the greeting API example, Spring if you need its JPA
   example, or remove both for a Supabase-only application.
3. Remove unused apps, their Compose services, and their entries in deployment
   matrices. pnpm and Moon discover the remaining workspace directories
   automatically.
4. Keep `packages/ui`, `packages/types`, and the shared ESLint and TypeScript
   configurations. Keep the logger and Jest presets only if a remaining app
   imports them.
5. Remove optional remote workflows you do not intend to configure. Review
   `supabase/remotes` before using its Terraform examples.
6. Run `pnpm install`, `pnpm verify:local`, and the browser suite for the
   frontend you retained.

The Spring API is an independent demonstration with an in-memory H2 database.
Its Item endpoints are not the private projects API and do not inherit Supabase
ownership checks. Choose persistence and authorization before exposing that
example as your application's backend.

The private-project example lives in
`apps/react-router-web/app/routes/projects.tsx`. It uses a verified
authenticated request, server-side validation, and the ordinary user Supabase
client. Database RLS is the ownership boundary. Keep that client separate from
admin credentials when adapting the example.
