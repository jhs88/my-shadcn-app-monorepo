import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { toast } from "sonner";
import { CurrentUserAvatar } from "~/components/current-user-avatar";
import Navbar from "~/components/navbar";

export default function Index() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto min-h-screen w-full overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:cursor-pointer"
            >
              <CurrentUserAvatar />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            My Profile Info
          </DialogContent>
        </Dialog>
        <Button onClick={() => toast("My first toast")}>Give me a toast</Button>
      </main>
    </>
  );
}
