import { logout } from "@/app/auth/actions";
import { Button } from "@repo/ui/components/button";
import { SubmitButton } from "@repo/ui/components/submit-button";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

export function LogoutButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <form action={logout}>
      <SubmitButton className={cn("w-full", className)} {...props}>
        Logout
      </SubmitButton>
    </form>
  );
}
