import { NavLink } from "react-router";
import type { Route } from "./+types/items._index";

const API_HOST = process.env.JAVA_API_HOST ?? "http://localhost:8080";

export async function loader(_: Route.LoaderArgs) {
  const res = await fetch(`${API_HOST}/items`);
  if (!res.ok) throw new Response("Not Found", { status: 404 });
  return res.json();
}

export default function Items({ loaderData }: Route.ComponentProps) {
  return (
    <div className="container m-4 mx-auto flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        List of Items
      </h1>
      <ul>
        {loaderData.map((item: { id: number; name: string }) => (
          <li key={item.id} className="text-2xl font-bold">
            <NavLink to={`/items/${item.id}`}>{item.name}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
