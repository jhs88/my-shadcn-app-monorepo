import { LoginForm } from "@/components/login-form";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { fetchProfileImage, fetchProfileName } from "../actions";
import Navbar from "@/components/navbar";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) redirect("/auth/login");

  const email: string | undefined = data?.user?.email;
  const name: string = data?.user?.user_metadata.full_name ?? email;
  const profileImage: string = data?.user?.user_metadata.avatar_url;

  const { data: profiles } = await supabase
    .from("profiles")
    .select()
    .filter("id", "eq", data?.user?.id);

  const profile = profiles ? profiles[0] : undefined;
  const initials = name
    ?.split(" ")
    ?.map((word) => word[0])
    ?.join("")
    ?.toUpperCase();

  return (
    <main className="container mx-auto min-h-screen w-full">
      <Navbar />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:cursor-pointer">
            <Avatar>
              <AvatarImage src={profileImage} alt={initials ?? "?"} />
              <AvatarFallback>{initials ?? "?"}</AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-h-60 w-full">
          <DialogHeader>
            <DialogTitle>My Profile Info</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent>
              <DialogDescription className="text-lg font-semibold">
                Email:
                <small className="float-right text-sm font-medium leading-none">
                  {email ?? "No User Logged In"}
                </small>
              </DialogDescription>
              <DialogDescription className="text-lg font-semibold">
                Is Verified:
                <small className="float-right text-sm font-medium leading-none">
                  {data?.user?.user_metadata.email_verified ? "yes" : "no"}
                </small>
              </DialogDescription>
              <DialogDescription className="text-lg font-semibold">
                Username:
                <small className="float-right text-sm font-medium leading-none">
                  {profile?.username ?? "No Username Found"}
                </small>
              </DialogDescription>
            </CardContent>
          </Card>
          {error || !data?.user ? <LoginForm /> : <LogoutButton />}
        </DialogContent>
      </Dialog>
    </main>
  );
}
