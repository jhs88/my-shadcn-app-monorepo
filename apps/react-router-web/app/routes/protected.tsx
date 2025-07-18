import { Button } from "@repo/ui/components/button";
import { redirect } from "react-router";
import { createClient } from "~/lib/supabase/server";
import type { Route } from "./+types/protected";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createClient(request);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return redirect("/login");
  }

  return data;
};

export default function ProtectedPage({ loaderData }: Route.ComponentProps) {

  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <p>
        Hello{" "}
        <span className="text-primary font-semibold">{loaderData.user.email}</span>
      </p>
      <a href="/logout">
        <Button>Logout</Button>
      </a>
    </div>
  );
}
