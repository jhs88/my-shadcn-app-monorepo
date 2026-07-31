import { createClient } from "~/lib/supabase/server";
import type {
  AuthAdapter,
  LoginInput,
  SignUpInput,
  StartOAuthLoginInput,
  StartPasswordResetInput,
  UpdatePasswordInput,
} from "./types";
import {
  login as loginOperation,
  logout as logoutOperation,
  signUp as signUpOperation,
  startOAuthLogin as startOAuthLoginOperation,
  startPasswordReset as startPasswordResetOperation,
  updatePassword as updatePasswordOperation,
} from "./operations";

const config = {
  protectedRedirect: "/test",
  signUpRedirect: "/sign-up?success",
  forgotPasswordRedirect: "/forgot-password?success",
  loginRedirect: "/test",
  logoutRedirect: "/",
};

function createAuthAdapter(request: Request) {
  const { supabase, headers } = createClient(request);

  const auth: AuthAdapter = {
    async signInWithPassword(input) {
      const { error } = await supabase.auth.signInWithPassword(input);
      return { error: error?.message ?? null };
    },
    async signUp(input) {
      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: input.emailRedirectTo,
        },
      });
      return { error: error?.message ?? null };
    },
    async resetPasswordForEmail(input) {
      const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: input.redirectTo,
      });
      return { error: error?.message ?? null };
    },
    async updatePassword(input) {
      const { error } = await supabase.auth.updateUser({
        password: input.password,
      });
      return { error: error?.message ?? null };
    },
    async signOut() {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message ?? null };
    },
    async signInWithOAuth(input) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${input.origin}/auth/oauth?next=/protected`,
        },
      });
      return { error: error?.message ?? null, url: data.url ?? null };
    },
  };

  return { auth, headers };
}

export async function login(request: Request, input: LoginInput) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await loginOperation(input, auth, config), headers };
}

export async function signUp(request: Request, input: SignUpInput) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await signUpOperation(input, auth, config), headers };
}

export async function startPasswordReset(
  request: Request,
  input: StartPasswordResetInput,
) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await startPasswordResetOperation(input, auth, config), headers };
}

export async function updatePassword(request: Request, input: UpdatePasswordInput) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await updatePasswordOperation(input, auth, config), headers };
}

export async function logout(request: Request) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await logoutOperation(auth, config), headers };
}

export async function startOAuthLogin(
  request: Request,
  input: StartOAuthLoginInput,
) {
  const { auth, headers } = createAuthAdapter(request);
  return { result: await startOAuthLoginOperation(input, auth), headers };
}
