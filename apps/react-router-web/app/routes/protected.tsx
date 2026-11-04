import { Button } from "@repo/ui/components/button";
import { data, Form } from "react-router";
import {
  authenticatedRequestContext,
  protectedRouteAuthMiddleware,
} from "~/auth/protected-route-auth.server";
import { pipeHeaders } from "~/utils/headers.server";
import type { Route } from "./+types/protected";

export const headers: Route.HeadersFunction = pipeHeaders;

export const middleware: Route.MiddlewareFunction[] = [
  protectedRouteAuthMiddleware,
];

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { user } = context.get(authenticatedRequestContext);

  return data({ user }, { headers: { "Cache-Control": "private, no-store" } });
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
      <Form method="post" action="/logout">
        <Button type="submit">Logout</Button>
      </Form>
    </div>
  );
}
