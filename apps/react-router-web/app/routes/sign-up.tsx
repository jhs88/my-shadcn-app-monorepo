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
  redirect,
  useFetcher,
  useSearchParams,
} from "react-router";
import { signUp as signUpWorkflow } from "~/auth/workflows/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const formData = await request.formData();
  const { result, headers } = await signUpWorkflow(request, {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    repeatPassword: String(formData.get("repeat-password") ?? ""),
    emailRedirectTo: `${origin}/protected`,
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "signed-up") return { error: "Unexpected sign-up result" };

  return redirect(result.redirectTo, { headers });
};

export default function SignUp() {
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
                <CardTitle className="text-2xl">
                  Thank you for signing up!
                </CardTitle>
                <CardDescription>Check your email to confirm</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  You've successfully signed up. Please check your email to
                  confirm your account before signing in.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Sign up</CardTitle>
                <CardDescription>Create a new account</CardDescription>
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
                        placeholder="m~example.com"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                      />
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
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating an account..." : "Sign up"}
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
