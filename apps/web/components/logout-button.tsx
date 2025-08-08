import { createClient } from "@/lib/supabase/server";
import { Button } from "@repo/ui/components/button";
import { redirect } from "next/navigation";

export function LogoutButton() {
  const logout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  return <Button onClick={logout}>Logout</Button>;
}
