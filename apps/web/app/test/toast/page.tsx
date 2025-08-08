"use client";

import { Button } from "@repo/ui/components/button";
import { toast } from "sonner";

export default function Page() {
  return (
    <Button onClick={() => toast("My first toast")}>Give me a toast</Button>
  );
}
