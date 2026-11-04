# Email sign-in links

Supabase sends three links that have to establish a session in your app: signup
confirmation, password recovery, and email change.

The default link verifies the token on Supabase's own endpoint and then
redirects to your `redirect_to` with the session in the URL fragment. A server
route cannot read a fragment, so nothing writes the session cookie and the user
arrives still signed out. Both example apps verify links on the server instead.

## The contract

Each app exposes a callback that calls `verifyOtp` with the token hash and then
redirects:

| App | Callback | | -------- | -------------------------------------------- |
-------------------------------------- | | Next |
`apps/web/app/auth/confirm/route.ts` | reads `token_hash` and `type` | | RR |
`apps/react-router-web/app/routes/auth.confirm.tsx` | same, plus a `next`
allowlist |

`emailConfirmTarget` in each app builds the `redirect_to` value:

```
http://localhost:5173/auth/confirm?next=%2Fupdate-password
```

The templates in `supabase/templates` append the credentials to that value:

```
{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery
```

Because the templates append with `&`, the `redirect_to` you pass must already
carry a query string. `emailConfirmTarget` guarantees this by always adding
`next`. Keep that guarantee if you change either side.

`next` is validated against a same-origin allowlist in each callback, so a
tampered link cannot send a user to another host.

## Local development

`supabase/config.toml` points `[auth.email.template.confirmation]` and
`[auth.email.template.recovery]` at the two templates. Restart the local stack
after editing a template; the CLI copies them in at startup.

Read the generated links without a real mail server. Mailpit listens on
`http://127.0.0.1:54324`, and `supabase status` reports its URL:

```bash
curl -s http://127.0.0.1:54324/api/v1/messages | head
```

Signup confirmation emails are only sent when
`[auth.email] enable_confirmations = true`. The starter leaves it off so signing
up is immediate. Turn it on to exercise the confirmation template.

Add every new callback host to `additional_redirect_urls` in the same file.
Supabase rejects a `redirect_to` that is not listed.

## Hosted projects

The dashboard template builder does not read `supabase/config.toml`, and neither
do self-hosted deployments configured elsewhere. Paste the same two templates
into **Authentication → Email templates** for each hosted project, then add the
app's origins to **Authentication → URL configuration**.

Keep `{{ .RedirectTo }}` rather than hardcoding a host. It carries the origin
the app actually sent, which is what lets one Supabase project serve both
examples.
