export type AuthFieldErrors = Partial<
  Record<"email" | "password" | "repeatPassword" | "origin", string>
>;

export type AuthWorkflowFailure = {
  ok: false;
  message: string;
  fieldErrors?: AuthFieldErrors;
};

export type AuthWorkflowSuccess =
  | {
      ok: true;
      status: "signed-in" | "signed-up" | "password-updated" | "signed-out";
      redirectTo: string;
    }
  | {
      ok: true;
      status: "password-reset-requested";
      redirectTo: string;
      message: string;
    }
  | {
      ok: true;
      status: "oauth-redirect";
      externalUrl: string;
    };

export type AuthWorkflowResult = AuthWorkflowFailure | AuthWorkflowSuccess;

export type LoginInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  repeatPassword: string;
  emailRedirectTo: string;
};

export type StartPasswordResetInput = {
  email: string;
  redirectTo: string;
};

export type UpdatePasswordInput = {
  password: string;
};

export type StartOAuthLoginInput = {
  origin: string;
};

export type AuthAdapter = {
  signInWithPassword(input: { email: string; password: string }): Promise<{
    error: string | null;
  }>;
  signUp(input: {
    email: string;
    password: string;
    emailRedirectTo: string;
  }): Promise<{ error: string | null }>;
  resetPasswordForEmail(input: {
    email: string;
    redirectTo: string;
  }): Promise<{ error: string | null }>;
  updatePassword(input: { password: string }): Promise<{ error: string | null }>;
  signOut(): Promise<{ error: string | null }>;
  signInWithOAuth(input: {
    origin: string;
  }): Promise<{ error: string | null; url: string | null }>;
};
