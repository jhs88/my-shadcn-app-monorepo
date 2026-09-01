import { type LoaderFunctionArgs, redirect } from "react-router";
import { createClient } from "~/lib/supabase/server";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const code = url.searchParams.get("code");
  const _next = url.searchParams.get("next");
  const next = _next?.startsWith("/") ? _next : "/";
  if (code) {
    const { supabase, headers } = createClient(request);

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    } else {
      return redirect(`/auth/error?error=${error?.message}`);
    }
  }
  // redirect the user to an error page with some instructions
  return redirect(`/auth/error`);
}
