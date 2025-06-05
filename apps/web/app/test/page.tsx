import Navbar from "@/components/navbar";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

export default function Index() {
  return (
    <main className="min-h-screen w-full overflow-hidden">
      <Navbar />
      <Dialog>
        <DialogTrigger asChild>
          <Button>Test</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>This is my content
        </DialogContent>
      </Dialog>
    </main>
  );
}
