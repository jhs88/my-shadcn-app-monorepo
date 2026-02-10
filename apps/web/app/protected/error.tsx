"use client"; // Error boundaries must be Client Components

import { Button } from "@repo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@repo/ui/components/item";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <Item>
        <ItemHeader className="justify-center">
          <ItemTitle className="from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
            500
          </ItemTitle>
        </ItemHeader>
        <ItemContent>
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Something went wrong!
          </h2>
          <ItemDescription>Oops! Something broke on our end!</ItemDescription>
        </ItemContent>
        <ItemFooter className="justify-center">
          <ItemActions>
            <Button size="lg" onClick={() => router.back()}>
              Go back
            </Button>
            <Button size="lg" variant="ghost" onClick={() => reset()}>
              Try again
            </Button>
          </ItemActions>
        </ItemFooter>
      </Item>
    </div>
  );
}