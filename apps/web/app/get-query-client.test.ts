import { expect, test } from "vitest";
import { getQueryClient } from "./get-query-client";

test("reuses the browser query client with hydration defaults", () => {
  const queryClient = getQueryClient();
  const defaultOptions = queryClient.getDefaultOptions();

  expect(getQueryClient()).toBe(queryClient);
  expect(window.__TANSTACK_QUERY_CLIENT__).toBe(queryClient);
  expect(defaultOptions.queries?.staleTime).toBe(60_000);
  expect(defaultOptions.dehydrate?.shouldRedactErrors?.(new Error())).toBe(false);
});
