"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { Loader2Icon } from "lucide-react";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  className,
  pendingText = "Please wait",
  ...props
}: SubmitButtonProps) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === "submit";

  return (
    <Button
      {...props}
      type="submit"
      aria-disabled={pending}
      className={cn(
        `${pending ? "cursor-progress" : "cursor-pointer"}`,
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2Icon />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
