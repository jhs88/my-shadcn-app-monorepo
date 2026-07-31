"use server";

import {
  login as loginWorkflow,
  logout as logoutWorkflow,
  signUp as signUpWorkflow,
  startOAuthLogin as startOAuthLoginWorkflow,
  startPasswordReset as startPasswordResetWorkflow,
  updatePassword as updatePasswordWorkflow,
} from "@/app/auth/workflows/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AuthActionState = {
  error?: string;
  success?: string;
};

export const initialAuthActionState: AuthActionState = {};

export async function signup(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const origin = String(formData.get("origin") ?? "");

  const result = await signUpWorkflow({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    repeatPassword: String(formData.get("repeat-password") ?? ""),
    emailRedirectTo: `${origin}/protected`,
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "signed-up") return { error: "Unexpected sign-up result" };

  redirect(result.redirectTo);
}

export async function login(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = await loginWorkflow({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "signed-in") return { error: "Unexpected login result" };

  if (result.revalidateLayout) {
    revalidatePath("/", "layout");
  }

  redirect(result.redirectTo);
}

export async function oauthLogin(origin: string) {
  const result = await startOAuthLoginWorkflow({ origin });

  if (!result.ok) {
    redirect(`/auth/error?error=${encodeURIComponent(result.message)}`);
  }
  if (result.status !== "oauth-redirect") {
    redirect("/auth/error?error=Unexpected%20OAuth%20result");
  }

  redirect(result.externalUrl);
}

export async function logout() {
  const result = await logoutWorkflow();

  if (!result.ok) {
    redirect(`/auth/error?error=${encodeURIComponent(result.message)}`);
  }
  if (result.status !== "signed-out") {
    redirect("/auth/error?error=Unexpected%20logout%20result");
  }

  redirect(result.redirectTo);
}

export async function requestPasswordReset(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const origin = String(formData.get("origin") ?? "");

  const result = await startPasswordResetWorkflow({
    email: String(formData.get("email") ?? ""),
    redirectTo: `${origin}/auth/update-password`,
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "password-reset-requested") {
    return { error: "Unexpected password reset result" };
  }

  return { success: result.message };
}

export async function saveUpdatedPassword(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = await updatePasswordWorkflow({
    password: String(formData.get("password") ?? ""),
  });

  if (!result.ok) return { error: result.message };
  if (result.status !== "password-updated") {
    return { error: "Unexpected password update result" };
  }

  redirect(result.redirectTo);
}
