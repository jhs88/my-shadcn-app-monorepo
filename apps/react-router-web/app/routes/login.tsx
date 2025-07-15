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
} from "react-router";
import { createClient } from "~/lib/supabase/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, headers } = createClient(request);
  const formData = await request.formData();
  const submission = formData.get("submission") as string;

  if (submission === "github") {
    const origin = new URL(request.url).origin;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/oauth?next=/protected`,
      },
    });

    if (data.url) {
      return redirect(data.url);
    }

    if (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
    return {};
  }

  if (submission === "credentials") {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }

    // Update this route to redirect to an authenticated route. The user already has an active session.
    return redirect("/protected", { headers });
  }

  return { error: "Invalid submission" };
};

export default function Login() {
  const credentialsFetcher = useFetcher<typeof action>();
  const oauthFetcher = useFetcher<typeof action>();

  const credentialsError = credentialsFetcher.data?.error;
  const oauthError = oauthFetcher.data?.error;

  const credentialsLoading = credentialsFetcher.state === "submitting";
  const oauthLoading = oauthFetcher.state === "submitting";
  const loading = credentialsLoading ?? oauthLoading;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <credentialsFetcher.Form method="post">
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
                      <Link
                        to="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      required
                    />
                  </div>
                  {credentialsError && (
                    <p className="text-sm text-red-500">{credentialsError}</p>
                  )}
                  <Button
                    type="submit"
                    name="submission"
                    value="credentials"
                    className="w-full"
                    disabled={loading}
                  >
                    {credentialsLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </credentialsFetcher.Form>
            </CardContent>
          </Card>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Card>
            <CardContent>
              <oauthFetcher.Form method="post">
                {oauthError && (
                  <p className="text-sm text-red-500">{oauthError}</p>
                )}
                <Button
                  variant="outline"
                  type="submit"
                  name="submission"
                  value="github"
                  className="w-full"
                  disabled={loading}
                >
                  {oauthLoading ? "Redirecting..." : "Github"}
                </Button>
              </oauthFetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}