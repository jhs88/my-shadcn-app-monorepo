import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import Navbar from "@/components/navbar";
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
    <main className="container mx-auto min-h-screen w-full">
      <Navbar />
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <p>
          Hello <span>{data.user.email}</span>
          <br />
          Username: <span>{profiles?.map((p) => p.username)}</span>
        </p>
        <LogoutButton />
      </div>
    </main>
  );
}
