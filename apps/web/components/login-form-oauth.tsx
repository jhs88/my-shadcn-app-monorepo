"use client";

import { oauthLogin } from "@/app/auth/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { SubmitButton } from "@repo/ui/components/submit-button";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";

export function OAuthLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => setOrigin(window.location.origin), []);

  const loginWithRedirect = oauthLogin.bind(null, origin);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginWithRedirect}>
            <div className="flex flex-col gap-6">
              <SubmitButton className="w-full" pendingText="Logging in...">
                Continue with Github
              </SubmitButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}