import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { createClient } from "~/utils/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createClient(request);
  const { data: instruments } = await supabase.from("instruments").select();

  return { instruments };
}

export default function Index() {
  const { instruments } = useLoaderData<typeof loader>();
  return (
    <ul>
      {instruments?.map((instrument) => (
        <li key={instrument.id}>{instrument.name}</li>
      ))}
    </ul>
  );
}
