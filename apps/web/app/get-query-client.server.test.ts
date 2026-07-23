// @vitest-environment node

import { expect, test } from "vitest";
import { getQueryClient } from "./get-query-client";

test("creates an isolated query client for each server request", () => {
  const firstQueryClient = getQueryClient();
  const secondQueryClient = getQueryClient();

  expect(secondQueryClient).not.toBe(firstQueryClient);
  expect(firstQueryClient.getDefaultOptions().queries?.staleTime).toBe(60_000);
});
