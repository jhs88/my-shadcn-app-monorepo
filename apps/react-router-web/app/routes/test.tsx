import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import Navbar from "~/components/navbar";

export default function Index() {
  return (
    <>
    <Navbar/> 
      <main className="container mx-auto min-h-screen w-full overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Dialog Button</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Title</DialogTitle>This is my content
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
