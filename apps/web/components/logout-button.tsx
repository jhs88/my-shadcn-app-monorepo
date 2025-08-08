import { createClient } from "@/lib/supabase/server";
import { Button } from "@repo/ui/components/button";
import { redirect } from "next/navigation";
import React from "react";

export function LogoutButton(props: React.ComponentProps<typeof Button>) {
  const logout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  return (
    <Button {...props} onClick={logout}>
      Logout
    </Button>
  );
}
