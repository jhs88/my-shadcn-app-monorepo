import { createClient } from "~/lib/supabase/server";
import type { Route } from "./+types/instruments._index";

export async function loader({ request }: Route.LoaderArgs) {
  const { supabase } = createClient(request);
  const { data: instruments } = await supabase.from("instruments").select();

  return { instruments };
}

export default function Instruments({ loaderData }: Route.ComponentProps) {
  const { instruments } = loaderData;
  return (
    <ul>
      {instruments?.map((instrument) => (
        <li key={instrument.id}>{instrument.name}</li>
      ))}
    </ul>
  );
}
