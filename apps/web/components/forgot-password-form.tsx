"use client";

import { initialAuthActionState } from "@/app/auth/action-state";
import { requestPasswordReset } from "@/app/auth/actions";
import { cn } from "@repo/ui/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@repo/ui/components/submit-button";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [origin, setOrigin] = useState("");
  const [state, formAction] = useActionState(
    requestPasswordReset,
    initialAuthActionState,
  );

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {state.success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <input type="hidden" name="origin" value={origin} />
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                {state.error && (
                  <p className="text-sm text-red-500">{state.error}</p>
                )}
                <SubmitButton pendingText="Sending" className="w-full">
                  Send reset email
                </SubmitButton>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
