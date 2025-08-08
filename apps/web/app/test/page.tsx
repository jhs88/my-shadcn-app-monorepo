import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { LoginForm } from "@/components/login-form";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) redirect("/auth/login");

  const { data: profiles } = await supabase
    .from("profiles")
    .select()
    .filter("id", "eq", data?.user?.id);

  const profile = profiles ? profiles[0] : undefined;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <CurrentUserAvatar />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-60 w-full">
        <DialogHeader>
          <DialogTitle>My Profile Info</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-lg font-semibold">
          Email:
          <small className="float-right text-sm font-medium leading-none">
            {data?.user?.email ?? "No User Logged In"}
          </small>
        </DialogDescription>
        <DialogDescription className="text-lg font-semibold">
          Is Verified:
          <small className="float-right text-sm font-medium leading-none">
            {data?.user?.user_metadata.email_verified ? "yes" : "no"}
          </small>
        </DialogDescription>{" "}
        <DialogDescription className="text-lg font-semibold">
          Username:
          <small className="float-right text-sm font-medium leading-none">
            {profile?.username ?? "No Username Found"}
          </small>
        </DialogDescription>
        {error || !data?.user ? <LoginForm /> : <LogoutButton />}
      </DialogContent>
    </Dialog>
  );
}
