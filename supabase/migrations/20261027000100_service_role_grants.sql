-- Admin-only local account preparation uses PostgREST, which still checks grants.
grant all on public.profiles, public.projects to service_role;
