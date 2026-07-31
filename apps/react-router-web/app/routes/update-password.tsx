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
import { type ActionFunctionArgs, redirect, useFetcher } from "react-router";
import { updatePassword as updatePasswordWorkflow } from "~/auth/workflows/server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { result, headers } = await updatePasswordWorkflow(request, {
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "password-updated") {
    return { error: "Unexpected password update result" };
  }

  return redirect(result.redirectTo, { headers });
};

export default function Page() {
  const fetcher = useFetcher<typeof action>();

  const error = fetcher.data?.error;
  const loading = fetcher.state === "submitting";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Your Password</CardTitle>
              <CardDescription>
                Please enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="post">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">New password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="New password"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Saving..." : "Save new password"}
                  </Button>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
