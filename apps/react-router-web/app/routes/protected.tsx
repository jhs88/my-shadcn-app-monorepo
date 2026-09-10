import { Button } from "@repo/ui/components/button";
import {
  authenticatedRequestContext,
  protectedRouteAuthMiddleware,
} from "~/auth/protected-route-auth.server";
import type { Route } from "./+types/protected";

export const middleware: Route.MiddlewareFunction[] = [
  protectedRouteAuthMiddleware,
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { user } = context.get(authenticatedRequestContext);

  return { user };
};

export default function ProtectedPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <p>
        Hello{" "}
        <span className="text-primary font-semibold">
          {loaderData.user.email}
        </span>
      </p>
      <a href="/logout">
        <Button>Logout</Button>
      </a>
    </div>
  );
}
