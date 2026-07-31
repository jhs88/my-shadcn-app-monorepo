import { createClient } from "@/lib/supabase/server";
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
  protectedRedirect: "/protected",
  signUpRedirect: "/auth/sign-up-success",
  loginRedirect: "/protected",
  logoutRedirect: "/auth/login",
};

async function createAuthAdapter(): Promise<AuthAdapter> {
  const supabase = await createClient();

  return {
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
          redirectTo: `${input.origin}/auth/oauth`,
        },
      });
      return { error: error?.message ?? null, url: data.url ?? null };
    },
  };
}

export async function login(input: LoginInput) {
  return loginOperation(input, await createAuthAdapter(), config);
}

export async function signUp(input: SignUpInput) {
  return signUpOperation(input, await createAuthAdapter(), config);
}

export async function startPasswordReset(input: StartPasswordResetInput) {
  return startPasswordResetOperation(input, await createAuthAdapter());
}

export async function updatePassword(input: UpdatePasswordInput) {
  return updatePasswordOperation(input, await createAuthAdapter(), config);
}

export async function logout() {
  return logoutOperation(await createAuthAdapter(), config);
}

export async function startOAuthLogin(input: StartOAuthLoginInput) {
  return startOAuthLoginOperation(input, await createAuthAdapter());
}
