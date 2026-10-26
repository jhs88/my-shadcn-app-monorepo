import { createParser } from "nuqs";
import type { ExtendedColumnSort } from "@repo/ui/types/data-table";

export function getSortingStateParser<TData>(columnIds: Set<string>) {
  return createParser<ExtendedColumnSort<TData>[]>({
    parse(value) {
      try {
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) return null;
        if (
          !parsed.every(
            (sort: unknown) =>
              typeof sort === "object" &&
              sort !== null &&
              "id" in sort &&
              typeof sort.id === "string" &&
              columnIds.has(sort.id) &&
              "desc" in sort &&
              typeof sort.desc === "boolean",
          )
        )
          return null;
        return parsed as ExtendedColumnSort<TData>[];
      } catch {
        return null;
      }
    },
    serialize: JSON.stringify,
    eq: (a, b) => JSON.stringify(a) === JSON.stringify(b),
  });
}
