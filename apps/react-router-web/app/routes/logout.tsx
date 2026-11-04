import { type ActionFunctionArgs, data, redirect } from "react-router";
import { logout as logoutWorkflow } from "~/auth/workflows/server";
import { pipeHeaders } from "~/utils/headers.server";

export const headers = pipeHeaders;

// Signing out changes state, so it is a POST. A plain link would let any page
// end the session with a top-level navigation.
export async function action({ request }: ActionFunctionArgs) {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    throw new Response("Forbidden", { status: 403 });
  }

  const { result, headers } = await logoutWorkflow(request);

  if (!result.ok)
    return data({ success: false, error: result.message }, { headers });
  if (result.status !== "signed-out") {
    return data(
      { success: false, error: "Unexpected logout result" },
      { headers },
    );
  }

  return redirect(result.redirectTo, { headers });
}
