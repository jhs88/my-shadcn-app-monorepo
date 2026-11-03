import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { getRedirectTarget } from "@/app/auth/redirect-target";

export async function GET(request: Request) {
  const responseHeaders = new Headers();
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getRedirectTarget(searchParams.get("next"), request.url);

  if (code) {
    const supabase = await createClient(responseHeaders);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Use the request origin, not an untrusted forwarded-host header.
      return NextResponse.redirect(next, {
        headers: responseHeaders,
      });
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`, {
    headers: responseHeaders,
  });
}
