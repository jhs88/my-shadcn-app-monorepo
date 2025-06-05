import { useRouteLoaderData } from "react-router";
import invariant from "tiny-invariant";
import { type loader as rootLoader } from "~/root";

/**
 * @returns The request info from the root loader (throws an error if it does
 *   not exist)
 */
export function useRequestInfo() {
  const maybeRequestInfo = useOptionalRequestInfo();
  invariant(maybeRequestInfo, "No requestInfo found in root loader");

  return maybeRequestInfo;
}

export function useOptionalRequestInfo() {
  const data = useRouteLoaderData<typeof rootLoader>("root");

  return data?.requestInfo;
}
