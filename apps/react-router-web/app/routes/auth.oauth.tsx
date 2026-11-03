import { type LoaderFunctionArgs, redirect } from "react-router";
import { safeNext } from "~/auth/safe-next";
import { createClient } from "~/lib/supabase/server";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  if (code) {
    const { supabase, headers } = createClient(request);

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    } else {
      return redirect(
        `/auth/error?error=${encodeURIComponent(error.message)}`,
        { headers },
      );
    }
  }
  // redirect the user to an error page with some instructions
  return redirect(`/auth/error`);
}
