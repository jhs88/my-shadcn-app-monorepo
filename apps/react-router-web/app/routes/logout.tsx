import { type ActionFunctionArgs, data, redirect } from "react-router";
import { logout as logoutWorkflow } from "~/auth/workflows/server";
import { pipeHeaders } from "~/utils/headers.server";

export const headers = pipeHeaders;

export async function loader({ request }: ActionFunctionArgs) {
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
