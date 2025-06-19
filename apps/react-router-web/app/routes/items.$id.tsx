import { Button } from "@repo/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "react-router";
import {
  RemixFormProvider as FormProvider,
  getValidatedFormData,
  useRemixForm,
} from "remix-hook-form";
import { z } from "zod";
import type { Route } from "./+types/items.$id";

const API_HOST = process.env.JAVA_API_HOST ?? "http://localhost:8080";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const resolver = zodResolver(formSchema);

export async function action({ params, request }: Route.ActionArgs) {
  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<FormData>(request, resolver);
  if (errors) return { errors, defaultValues };

  return await fetch(`${API_HOST}/items/${params.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function loader({ params }: Route.LoaderArgs) {
  const res = await fetch(`${API_HOST}/items/${params.id}`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json();
}

export default function UpdateItem({ loaderData }: Route.ComponentProps) {
  const item = loaderData;
  const form = useRemixForm<z.infer<typeof formSchema>>({
    resolver,
    defaultValues: {
      name: "",
    },
  });

  return (
    <div className="container m-4 mx-auto flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Update Item
      </h1>
      <FormProvider {...form}>
        <Form
          onSubmit={form.handleSubmit}
          method="post"
          className="center w-full max-w-2xl space-x-3 py-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Example Item" />
                </FormControl>
                <FormDescription>This is your item name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button size="sm" type="submit" className="mt-4 hover:cursor-pointer">
            {form.formState.isSubmitting ? "Updating..." : "Update Item"}
          </Button>
        </Form>
      </FormProvider>
      {item && (
        <p className="text-2xl font-bold">{`Item: ${JSON.stringify(item)}`}</p>
      )}
    </div>
  );
}
