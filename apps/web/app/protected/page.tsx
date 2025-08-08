import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/auth/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select()
    .filter("id", "eq", data.user.id);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <p>
        Hello <span>{data.user.email}</span>
        <br />
        Username: <span>{profiles?.map((p: any) => p.username)}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
