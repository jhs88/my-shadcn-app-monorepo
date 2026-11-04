import { describe, expect, it } from "vitest";
import { emailConfirmTarget } from "./callback-targets";

describe("emailConfirmTarget", () => {
  it("points the email link at the server-side confirm callback", () => {
    expect(
      emailConfirmTarget("http://localhost:3000", "/auth/update-password"),
    ).toBe("http://localhost:3000/auth/confirm?next=%2Fauth%2Fupdate-password");
  });

  it("keeps a non-default port", () => {
    expect(emailConfirmTarget("http://127.0.0.1:5173", "/protected")).toBe(
      "http://127.0.0.1:5173/auth/confirm?next=%2Fprotected",
    );
  });

  it("trims a trailing slash so the callback path stays intact", () => {
    expect(emailConfirmTarget("http://localhost:3000/", "/protected")).toBe(
      "http://localhost:3000/auth/confirm?next=%2Fprotected",
    );
  });

  it("returns an empty target for a missing origin", () => {
    expect(emailConfirmTarget("   ", "/protected")).toBe("");
  });

  it("already carries a query, which the email template appends to with &", () => {
    const target = new URL(emailConfirmTarget("http://localhost:3000", "/x"));
    const link = new URL(`${target.href}&token_hash=abc&type=recovery`);

    expect(link.pathname).toBe("/auth/confirm");
    expect(link.searchParams.get("next")).toBe("/x");
    expect(link.searchParams.get("token_hash")).toBe("abc");
    expect(link.searchParams.get("type")).toBe("recovery");
  });
});
