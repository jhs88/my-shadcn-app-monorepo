import type { Route } from "./+types/resources.healthcheck";

export async function loader({ request, url }: Route.LoaderArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    // if we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good.
    await Promise.all([
      fetch(`${url.protocol}${host}`, {
        method: "HEAD",
        headers: { "X-Healthcheck": "true" },
      }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
}
