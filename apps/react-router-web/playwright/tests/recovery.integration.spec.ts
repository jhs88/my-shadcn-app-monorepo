import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { latestLinkSentTo } from "../fixtures/mailpit";

test("a password-reset link establishes a session and updates the password", async ({
  page,
}) => {
  // A throwaway account keeps the rotation from disturbing the shared demo user.
  const email = `recovery-${randomUUID()}@example.com`;
  const firstPassword = "Recovery-first-123!";
  const secondPassword = "Recovery-second-456!";

  await page.goto("/sign-up");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(firstPassword);
  await page.getByLabel("Repeat Password").fill(firstPassword);
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL("**/sign-up**");

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send reset email" }).click();
  await expect(page.getByText("Check Your Email")).toBeVisible();

  const link = await latestLinkSentTo(email);
  const callback = new URL(link);

  // The default Supabase template points at Supabase's own verify endpoint and
  // returns the session in a URL fragment, which no server route can read.
  expect(callback.pathname).toBe("/auth/confirm");
  expect(callback.searchParams.get("type")).toBe("recovery");
  expect(callback.searchParams.get("token_hash")).toBeTruthy();
  expect(callback.searchParams.get("next")).toBe("/update-password");

  await page.goto(link);
  await page.waitForURL("**/update-password");

  await page.getByLabel("New password").fill(secondPassword);
  await page.getByRole("button", { name: "Save new password" }).click();
  await page.waitForURL("**/test");

  const projects = await page.request.get("/projects.data");
  expect(projects.status()).toBe(200);
});
