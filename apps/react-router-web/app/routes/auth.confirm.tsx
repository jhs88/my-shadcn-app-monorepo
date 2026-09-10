import { type EmailOtpType } from "@supabase/supabase-js";
import { type LoaderFunctionArgs, redirect } from "react-router";
import { createClient } from "~/lib/supabase/server";

export async function loader({ request, url }: LoaderFunctionArgs) {
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const _next = url.searchParams.get("next");
  const next = _next?.startsWith("/") ? _next : "/";

  if (token_hash && type) {
    const { supabase, headers } = createClient(request);
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return redirect(next, { headers });
    } else {
      return redirect(`/auth/error?error=${error?.message}`);
    }
  }

  // redirect the user to an error page with some instructions
  return redirect(`/auth/error?error=No token hash or type`);
}
