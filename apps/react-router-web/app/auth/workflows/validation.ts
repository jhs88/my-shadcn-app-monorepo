import type {
  AuthWorkflowFailure,
  LoginInput,
  SignUpInput,
  StartOAuthLoginInput,
  StartPasswordResetInput,
  UpdatePasswordInput,
} from "./types";

function failure(
  message: string,
  fieldErrors?: AuthWorkflowFailure["fieldErrors"],
): AuthWorkflowFailure {
  return { ok: false, message, fieldErrors };
}

export function validateLoginInput(input: LoginInput) {
  if (!input.email) return failure("Email is required", { email: "Required" });
  if (!input.password) {
    return failure("Password is required", { password: "Required" });
  }
  return null;
}

export function validateSignUpInput(input: SignUpInput) {
  if (!input.email) return failure("Email is required", { email: "Required" });
  if (!input.password) {
    return failure("Password is required", { password: "Required" });
  }
  if (!input.repeatPassword) {
    return failure("Repeat password is required", {
      repeatPassword: "Required",
    });
  }
  if (input.password !== input.repeatPassword) {
    return failure("Passwords do not match", {
      repeatPassword: "Must match password",
    });
  }
  if (!input.emailRedirectTo) {
    return failure("Missing sign-up redirect target");
  }
  return null;
}

export function validatePasswordResetInput(input: StartPasswordResetInput) {
  if (!input.email) return failure("Email is required", { email: "Required" });
  if (!input.redirectTo) return failure("Missing password reset redirect target");
  return null;
}

export function validateUpdatePasswordInput(input: UpdatePasswordInput) {
  if (!input.password) {
    return failure("Password is required", { password: "Required" });
  }
  return null;
}

export function validateOAuthLoginInput(input: StartOAuthLoginInput) {
  if (!input.origin) return failure("Missing OAuth origin", { origin: "Required" });
  return null;
}
