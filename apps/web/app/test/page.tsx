import PageContainer from "@/components/layout/page-container";
import { createClient } from "@/lib/supabase/server";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@repo/ui/components/item";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/auth/login");

  const email: string | undefined = data?.user?.email;
  const name: string = data?.user?.user_metadata.full_name ?? email;
  const emailVerified: string = data?.user?.user_metadata.email_verified;
  const profileImage: string | undefined =
    data?.user?.user_metadata.avatar_url ?? "";

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
    <PageContainer>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:cursor-pointer">
            <Avatar>
              <AvatarImage
                src={profile?.avatar_url ?? profileImage}
                alt={initials ?? "?"}
              />
              <AvatarFallback>{initials ?? "?"}</AvatarFallback>
            </Avatar>
          </Button>
        </DialogTrigger>
        <DialogContent className="min-h-60 w-full">
          <DialogHeader>
            <DialogTitle>My Profile Info</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-140 w-full">
            <ItemGroup className="gap-2">
              <Item variant="outline">
                <ItemHeader>
                  <ItemTitle>Email</ItemTitle>
                  <ItemDescription>
                    <small className="float-right text-sm font-medium leading-none">
                      {email ?? "No User Logged In"}
                    </small>
                  </ItemDescription>
                </ItemHeader>
              </Item>
              <Item variant="outline">
                <ItemHeader>
                  <ItemTitle>Is Verified</ItemTitle>
                  <ItemDescription>
                    <small className="float-right text-sm font-medium leading-none">
                      {emailVerified ? "yes" : "no"}
                    </small>
                  </ItemDescription>
                </ItemHeader>
              </Item>
              <Item variant="outline">
                <ItemHeader>
                  <ItemTitle>Username</ItemTitle>
                  <ItemDescription>
                    <small className="float-right text-sm font-medium leading-none">
                      {profile?.username ?? "No Username Found"}
                    </small>
                  </ItemDescription>
                </ItemHeader>
              </Item>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Avatar</ItemTitle>
                  <ItemDescription></ItemDescription>
                </ItemContent>
                <ItemHeader>
                  <ItemMedia variant="image" className="h-fit w-full">
                    <img
                      className="object-cover"
                      src={profile?.avatar_url ?? profileImage}
                      alt={initials ?? "?"}
                    />
                  </ItemMedia>
                </ItemHeader>
              </Item>
            </ItemGroup>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
