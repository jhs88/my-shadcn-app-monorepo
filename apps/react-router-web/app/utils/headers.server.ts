import { type CacheControlValue, parse, format } from "@tusbar/cache-control";
import { type HeadersArgs } from "react-router";

/**
 * Inherit parent headers and forward route cache policy, variation and timing.
 * Actions and revalidated loaders can both contribute headers to one response.
 * React Router merges Set-Cookie headers separately, including parent cookies.
 */
export function pipeHeaders({
  parentHeaders,
  loaderHeaders,
  actionHeaders,
  errorHeaders,
}: HeadersArgs) {
  const headers = new Headers(parentHeaders);
  const routeHeaders = [loaderHeaders, actionHeaders, errorHeaders].filter(
    (source): source is Headers => source !== undefined,
  );
  const cacheControl = getConservativeCacheControl(
    parentHeaders.get("Cache-Control"),
    ...routeHeaders.map((source) => source.get("Cache-Control")),
  );
  if (cacheControl) headers.set("Cache-Control", cacheControl);

  for (const source of routeHeaders) {
    for (const name of ["Vary", "Server-Timing"]) {
      const value = source.get(name);
      if (value) headers.append(name, value);
    }
    for (const name of ["Pragma", "Expires"]) {
      const value = source.get(name);
      if (value) headers.set(name, value);
    }
  }

  return headers;
}

/**
 * Given multiple Cache-Control headers, merge them and get the most
 * conservative one.
 */
export function getConservativeCacheControl(
  ...cacheControlHeaders: Array<string | null>
): string {
  return format(
    cacheControlHeaders
      .filter(Boolean)
      .map((header) => parse(header ?? undefined))
      .reduce<CacheControlValue>((acc, current) => {
        for (const key in current) {
          const directive = key as keyof Required<CacheControlValue>; // keyof CacheControl includes functions

          const currentValue = current[directive];

          switch (typeof currentValue) {
            case "boolean": {
              if (currentValue) {
                acc[directive] = true as any;
              }

              break;
            }
            case "number": {
              const accValue = acc[directive] as number | undefined;

              if (accValue === undefined) {
                acc[directive] = currentValue as any;
              } else {
                const result = Math.min(accValue, currentValue);
                acc[directive] = result as any;
              }

              break;
            }
          }
        }

        return acc;
      }, {}),
  );
}
