import { Spinner } from "@repo/ui/components/spinner";

export default function Loading() {
  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <Spinner className="place-self-center-safe size-8" />
    </div>
  );
}
