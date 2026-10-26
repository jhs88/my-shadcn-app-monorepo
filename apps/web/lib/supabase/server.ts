import type { Database } from "@repo/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(responseHeaders?: Headers) {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, headersToSet) {
          Object.entries(headersToSet).forEach(([name, value]) =>
            responseHeaders?.set(name, value),
          );
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
