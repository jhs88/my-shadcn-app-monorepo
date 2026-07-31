import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  type ActionFunctionArgs,
  Link,
  data,
  redirect,
  useFetcher,
  useSearchParams,
} from "react-router";
import { startPasswordReset as startPasswordResetWorkflow } from "~/auth/workflows/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const origin = new URL(request.url).origin;
  const { result, headers } = await startPasswordResetWorkflow(request, {
    email: String(formData.get("email") ?? ""),
    redirectTo: `${origin}/auth/confirm?next=/update-password`,
  });

  if (!result.ok) {
    return data(
      {
        error: result.message,
        data: { email: String(formData.get("email") ?? "") },
      },
      { headers },
    );
  }

  if (result.status !== "password-reset-requested") {
    return data({ error: "Unexpected password reset result" }, { headers });
  }

  return redirect(result.redirectTo, { headers });
};

export default function ForgotPassword() {
  const fetcher = useFetcher<typeof action>();
  let [searchParams] = useSearchParams();

  const success = !!searchParams.has("success");
  const error = fetcher.data?.error;
  const loading = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {success ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  Password reset instructions sent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  If you registered using your email and password, you will
                  receive a password reset email.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                <CardDescription>
                  Type in your email and we&apos;ll send you a link to reset
                  your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <fetcher.Form method="post">
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
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending..." : "Send reset email"}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Login
                    </Link>
                  </div>
                </fetcher.Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
