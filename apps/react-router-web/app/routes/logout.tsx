import { type ActionFunctionArgs, redirect } from "react-router";
import { logout as logoutWorkflow } from "~/auth/workflows/server";

export async function loader({ request }: ActionFunctionArgs) {
  const { result, headers } = await logoutWorkflow(request);

  if (!result.ok) return { success: false, error: result.message };
  if (result.status !== "signed-out") {
    return { success: false, error: "Unexpected logout result" };
  }

  return redirect(result.redirectTo, { headers });
}
