import type {
  AuthAdapter,
  AuthWorkflowResult,
  LoginInput,
  SignUpInput,
  StartOAuthLoginInput,
  StartPasswordResetInput,
  UpdatePasswordInput,
} from "./types";
import {
  validateLoginInput,
  validateOAuthLoginInput,
  validatePasswordResetInput,
  validateSignUpInput,
  validateUpdatePasswordInput,
} from "./validation";

type AuthWorkflowConfig = {
  protectedRedirect: string;
  signUpRedirect: string;
  forgotPasswordRedirect: string;
  loginRedirect: string;
  logoutRedirect: string;
};

export async function login(
  input: LoginInput,
  auth: AuthAdapter,
  config: AuthWorkflowConfig,
): Promise<AuthWorkflowResult> {
  const invalid = validateLoginInput(input);
  if (invalid) return invalid;

  const { error } = await auth.signInWithPassword(input);
  if (error) return { ok: false, message: error };

  return {
    ok: true,
    status: "signed-in",
    redirectTo: config.loginRedirect,
  };
}

export async function signUp(
  input: SignUpInput,
  auth: AuthAdapter,
  config: AuthWorkflowConfig,
): Promise<AuthWorkflowResult> {
  const invalid = validateSignUpInput(input);
  if (invalid) return invalid;

  const { error } = await auth.signUp(input);
  if (error) return { ok: false, message: error };

  return {
    ok: true,
    status: "signed-up",
    redirectTo: config.signUpRedirect,
  };
}

export async function startPasswordReset(
  input: StartPasswordResetInput,
  auth: AuthAdapter,
  config: AuthWorkflowConfig,
): Promise<AuthWorkflowResult> {
  const invalid = validatePasswordResetInput(input);
  if (invalid) return invalid;

  const { error } = await auth.resetPasswordForEmail(input);
  if (error) return { ok: false, message: error };

  return {
    ok: true,
    status: "password-reset-requested",
    redirectTo: config.forgotPasswordRedirect,
    message: "Password reset instructions sent",
  };
}

export async function updatePassword(
  input: UpdatePasswordInput,
  auth: AuthAdapter,
  config: AuthWorkflowConfig,
): Promise<AuthWorkflowResult> {
  const invalid = validateUpdatePasswordInput(input);
  if (invalid) return invalid;

  const { error } = await auth.updatePassword(input);
  if (error) return { ok: false, message: error };

  return {
    ok: true,
    status: "password-updated",
    redirectTo: config.protectedRedirect,
  };
}

export async function logout(
  auth: AuthAdapter,
  config: AuthWorkflowConfig,
): Promise<AuthWorkflowResult> {
  const { error } = await auth.signOut();
  if (error) return { ok: false, message: error };

  return {
    ok: true,
    status: "signed-out",
    redirectTo: config.logoutRedirect,
  };
}

export async function startOAuthLogin(
  input: StartOAuthLoginInput,
  auth: AuthAdapter,
): Promise<AuthWorkflowResult> {
  const invalid = validateOAuthLoginInput(input);
  if (invalid) return invalid;

  const { error, url } = await auth.signInWithOAuth(input);
  if (error) return { ok: false, message: error };
  if (!url) return { ok: false, message: "Missing OAuth redirect URL" };

  return {
    ok: true,
    status: "oauth-redirect",
    externalUrl: url,
  };
}
