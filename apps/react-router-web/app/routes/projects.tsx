import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { ArrowLeft, Folder, Plus } from "lucide-react";
import {
  data,
  Form,
  isRouteErrorResponse,
  Link,
  useNavigation,
  useRouteError,
} from "react-router";
import { z } from "zod";
import {
  authenticatedRequestContext,
  protectedRouteAuthMiddleware,
} from "~/auth/protected-route-auth.server";
import { pipeHeaders } from "~/utils/headers.server";
import type { Route } from "./+types/projects";

export const headers: Route.HeadersFunction = pipeHeaders;
export const middleware: Route.MiddlewareFunction[] = [
  protectedRouteAuthMiddleware,
];
export const meta: Route.MetaFunction = () => [{ title: "Your projects" }];
const privateHeaders = { "Cache-Control": "private, no-store" };
const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Give your project a name.")
    .max(100, "Use at most 100 characters for the name."),
  description: z
    .string()
    .trim()
    .max(1000, "Use at most 1,000 characters for the description."),
});

export async function loader({ context }: Route.LoaderArgs) {
  const { supabase, user } = context.get(authenticatedRequestContext);
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, name, description")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  if (error)
    throw new Response("Projects could not be loaded. Please try again.", {
      status: 503,
      headers: privateHeaders,
    });
  return data({ projects }, { headers: privateHeaders });
}

export async function action({ request, context }: Route.ActionArgs) {
  const { supabase, user } = context.get(authenticatedRequestContext);
  // Forms use same-origin POSTs. Reject cross-site submissions before a mutation.
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new Response("Forbidden", { status: 403 });
  }
  const form = await request.formData();
  const intent = form.get("intent");
  const invalid = (message: string, status = 400) =>
    data({ error: message }, { status, headers: privateHeaders });
  if (!["create", "update", "delete"].includes(String(intent)))
    return invalid("Unknown project action.");

  const id = z.uuid().safeParse(form.get("id"));
  if (intent !== "create" && !id.success)
    return invalid("Choose a valid project.");
  const values = projectSchema.safeParse({
    name: form.get("name"),
    description: form.get("description") ?? "",
  });
  if (intent !== "delete" && !values.success)
    return invalid(
      values.error.issues[0]?.message ?? "Check the project details.",
    );

  let result;
  if (intent === "create" && values.success) {
    result = await supabase
      .from("projects")
      .insert({ ...values.data, owner_id: user.id })
      .select("id")
      .single();
  } else if (intent === "update" && values.success && id.success) {
    result = await supabase
      .from("projects")
      .update(values.data)
      .eq("id", id.data)
      .eq("owner_id", user.id)
      .select("id")
      .maybeSingle();
  } else if (id.success) {
    result = await supabase
      .from("projects")
      .delete()
      .eq("id", id.data)
      .eq("owner_id", user.id)
      .select("id")
      .maybeSingle();
  }
  if (!result || result.error)
    return invalid("Your change could not be saved. Please try again.", 503);
  if (!result.data) return invalid("That project is unavailable.", 404);
  return data({ error: null }, { headers: privateHeaders });
}

export default function Projects({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const pending = useNavigation().state !== "idle";
  return (
    <main className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
      <nav className="mb-12 flex items-center justify-between text-sm">
        <Link
          to="/test"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
        >
          <ArrowLeft className="size-4" />
          Your account
        </Link>
        <Link
          to="/logout"
          className="text-muted-foreground hover:text-foreground"
        >
          Sign out
        </Link>
      </nav>
      <header className="mb-10 border-b pb-8">
        <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
          Your workspace
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="text-muted-foreground mt-4 max-w-lg">
          A place for what comes next. Keep a name and a few notes for each
          project. Only you can access them.
        </p>
      </header>
      {actionData?.error && (
        <p
          role="alert"
          className="border-destructive text-destructive mb-6 rounded-md border p-4"
        >
          {actionData.error}
        </p>
      )}
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_18rem]">
        <section
          aria-label="Your projects"
          aria-busy={pending}
          className="min-w-0"
        >
          <p className="text-muted-foreground mb-4 font-mono text-xs">
            {String(loaderData.projects.length).padStart(2, "0")} PROJECTS
          </p>
          {loaderData.projects.length === 0 ? (
            <div className="rounded-lg border border-dashed px-6 py-16 text-center">
              <Folder className="text-muted-foreground mx-auto mb-4 size-8" />
              <h2 className="font-medium">Your first project starts here</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Add a name and a few notes to get started.
              </p>
            </div>
          ) : (
            <ul className="divide-y border-y">
              {loaderData.projects.map((project) => (
                <li key={project.id} className="py-6">
                  <h2 className="text-xl font-medium break-words">
                    {project.name}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed break-words whitespace-pre-wrap">
                    {project.description || "No notes yet."}
                  </p>
                  <details className="mt-4">
                    <summary className="text-muted-foreground hover:text-foreground w-fit cursor-pointer text-sm">
                      Edit project
                    </summary>
                    <Form method="post" className="mt-4 grid gap-3">
                      <input type="hidden" name="id" value={project.id} />
                      <Label htmlFor={`name-${project.id}`}>Project name</Label>
                      <Input
                        id={`name-${project.id}`}
                        name="name"
                        defaultValue={project.name}
                        required
                        maxLength={100}
                      />
                      <Label htmlFor={`description-${project.id}`}>Notes</Label>
                      <Textarea
                        id={`description-${project.id}`}
                        name="description"
                        defaultValue={project.description}
                        maxLength={1000}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          name="intent"
                          value="update"
                          disabled={pending}
                        >
                          Save changes
                        </Button>
                        <Button
                          type="submit"
                          name="intent"
                          value="delete"
                          variant="destructive"
                          formNoValidate
                          disabled={pending}
                        >
                          Delete project
                        </Button>
                      </div>
                    </Form>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section
          aria-labelledby="new-project-heading"
          className="bg-muted/30 rounded-lg border p-6"
        >
          <h2
            id="new-project-heading"
            className="mb-5 flex items-center gap-2 font-medium"
          >
            <Plus className="size-4" />
            New project
          </h2>
          <Form
            method="post"
            className="grid gap-3"
            key={loaderData.projects.map((project) => project.id).join(",")}
          >
            <input type="hidden" name="intent" value="create" />
            <Label htmlFor="new-project-name">Project name</Label>
            <Input
              id="new-project-name"
              name="name"
              placeholder="What are you working on?"
              required
              maxLength={100}
            />
            <Label htmlFor="new-project-description" className="mt-2">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                optional
              </span>
            </Label>
            <Textarea
              id="new-project-description"
              name="description"
              placeholder="A few words about the idea…"
              rows={4}
              maxLength={1000}
            />
            <Button type="submit" className="mt-2" disabled={pending}>
              {pending ? "Saving…" : "Create project"}
            </Button>
          </Form>
        </section>
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-2xl font-semibold">Projects are unavailable</h1>
      <p role="alert" className="text-muted-foreground my-4">
        {isRouteErrorResponse(error) && typeof error.data === "string"
          ? error.data
          : "Please try again in a moment."}
      </p>
      <Link to="/projects" className="underline">
        Try again
      </Link>
    </main>
  );
}
