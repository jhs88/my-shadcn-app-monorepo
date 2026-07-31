import { describe, expect, it, vi } from "vitest";
import {
  login,
  logout,
  signUp,
  startOAuthLogin,
  startPasswordReset,
  updatePassword,
} from "./operations";
import type { AuthAdapter } from "./types";

const config = {
  protectedRedirect: "/protected",
  signUpRedirect: "/auth/sign-up-success",
  loginRedirect: "/protected",
  logoutRedirect: "/auth/login",
};

function createAuthAdapter(overrides: Partial<AuthAdapter> = {}): AuthAdapter {
  return {
    signInWithPassword: vi.fn(async () => ({ error: null })),
    signUp: vi.fn(async () => ({ error: null })),
    resetPasswordForEmail: vi.fn(async () => ({ error: null })),
    updatePassword: vi.fn(async () => ({ error: null })),
    signOut: vi.fn(async () => ({ error: null })),
    signInWithOAuth: vi.fn(async () => ({
      error: null,
      url: "https://example.com/oauth",
    })),
    ...overrides,
  };
}

describe("web auth workflow operations", () => {
  it("rejects missing login credentials before the adapter", async () => {
    const auth = createAuthAdapter();

    const result = await login({ email: "", password: "" }, auth, config);

    expect(result).toEqual({
      ok: false,
      message: "Email is required",
      fieldErrors: { email: "Required" },
    });
    expect(auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("returns a protected redirect after successful login", async () => {
    const auth = createAuthAdapter();

    const result = await login(
      { email: "m@example.com", password: "secret" },
      auth,
      config,
    );

    expect(result).toEqual({
      ok: true,
      status: "signed-in",
      redirectTo: "/protected",
      revalidateLayout: true,
    });
  });

  it("keeps sign-up validation inside the workflow", async () => {
    const auth = createAuthAdapter();

    const result = await signUp(
      {
        email: "m@example.com",
        password: "secret",
        repeatPassword: "different",
        emailRedirectTo: "http://localhost:3000/protected",
      },
      auth,
      config,
    );

    expect(result).toEqual({
      ok: false,
      message: "Passwords do not match",
      fieldErrors: {
        repeatPassword: "Must match password",
      },
    });
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it("returns a success message for password reset", async () => {
    const auth = createAuthAdapter();

    const result = await startPasswordReset(
      {
        email: "m@example.com",
        redirectTo: "http://localhost:3000/auth/update-password",
      },
      auth,
    );

    expect(result).toEqual({
      ok: true,
      status: "password-reset-requested",
      message: "Password reset instructions sent",
    });
  });

  it("returns a protected redirect after password update", async () => {
    const auth = createAuthAdapter();

    const result = await updatePassword({ password: "new-secret" }, auth, config);

    expect(result).toEqual({
      ok: true,
      status: "password-updated",
      redirectTo: "/protected",
    });
  });

  it("returns an external URL for oauth login", async () => {
    const auth = createAuthAdapter();

    const result = await startOAuthLogin(
      { origin: "http://localhost:3000" },
      auth,
    );

    expect(result).toEqual({
      ok: true,
      status: "oauth-redirect",
      externalUrl: "https://example.com/oauth",
    });
  });

  it("returns the logout redirect from the workflow", async () => {
    const auth = createAuthAdapter();

    const result = await logout(auth, config);

    expect(result).toEqual({
      ok: true,
      status: "signed-out",
      redirectTo: "/auth/login",
    });
  });
});
