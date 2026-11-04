/**
 * Build the `redirect_to` value for a Supabase email link.
 *
 * The link has to land on a route that can verify the token on the server and
 * write the session cookie. Supabase's default template verifies on its own
 * endpoint and returns the session in a URL fragment, which no server route can
 * read, so the session is never persisted.
 *
 * The local templates in `supabase/templates` append `token_hash` and `type`
 * with `&`, so the value returned here must already carry a query string.
 *
 * Returns an empty string for a missing origin so the workflow reports a
 * validation failure instead of throwing.
 */
export function emailConfirmTarget(origin: string, next: string): string {
  const base = origin.trim().replace(/\/+$/, "");
  if (!base) return "";

  return `${base}/auth/confirm?next=${encodeURIComponent(next)}`;
}
