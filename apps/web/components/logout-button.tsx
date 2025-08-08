import { createClient } from "@/lib/supabase/server";
import { Button } from "@repo/ui/components/button";
import { SubmitButton } from "@repo/ui/components/submit-button";
import { cn } from "@repo/ui/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

export function LogoutButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const logout = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  return (
    <form action={logout}>
      <SubmitButton className={cn("w-full", className)} {...props}>
        Logout
      </SubmitButton>
    </form>
  );
}
