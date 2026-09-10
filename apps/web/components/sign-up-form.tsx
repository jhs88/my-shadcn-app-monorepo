"use client";

import { initialAuthActionState } from "@/app/auth/action-state";
import { signup } from "@/app/auth/actions";
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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [origin, setOrigin] = useState("");
  const [state, formAction] = useActionState(signup, initialAuthActionState);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  name="repeat-password"
                  type="password"
                  required
                />
              </div>
              {state.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
              <SubmitButton pendingText="Creating Account" className="w-full">
                Sign up
              </SubmitButton>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
