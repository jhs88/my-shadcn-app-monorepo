"use client";

import { Button } from "@repo/ui/components/button";
import { useInfobar, type InfobarContent } from "@repo/ui/components/infobar";
import { cn } from "@repo/ui/lib/utils";
import { Info } from "lucide-react";
import * as React from "react";

interface InfoButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "content"> {
  content: InfobarContent;
  variant?:
    | "default"
    | "ghost"
    | "outline"
    | "secondary"
    | "destructive"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function InfoButton({
  content,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: InfoButtonProps) {
  const { setContent, setOpen } = useInfobar();

  // Automatically set content when component mounts (e.g., on page load/refresh)
  React.useEffect(() => {
    setContent(content);
  }, [content, setContent]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setContent(content);
    setOpen(true);
    props.onClick?.(e);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      onClick={handleClick}
      aria-label="Show information"
      {...props}
    >
      <Info className="h-4 w-4" />
      <span className="sr-only">Show information</span>
    </Button>
  );
}
