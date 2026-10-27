import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { testUser } from "../fixtures/test-user";
import { LoginPage } from "../pages/login-page";

test("a private project survives reload, validates edits, and can be deleted", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.waitForURL("**/login");
  await new LoginPage(page).login(testUser);
  await page.waitForURL("**/test");
  await page.getByRole("link", { name: "Your projects", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Projects", exact: true }),
  ).toBeVisible();

  const document = await page.reload();
  expect(document?.headers()["cache-control"]).toContain("private");
  expect(document?.headers()["cache-control"]).toContain("no-store");
  const navigation = await page.request.get("/projects.data");
  expect(navigation.headers()["cache-control"]).toContain("private");
  expect(navigation.headers()["cache-control"]).toContain("no-store");

  const name = `Project ${randomUUID()}`;
  const form = page.getByRole("region", { name: "New project" });
  await form.getByLabel("Project name").fill("   ");
  await form.getByRole("button", { name: "Create project" }).click();
  await expect(page.getByRole("alert")).toHaveText("Give your project a name.");

  await form.getByLabel("Project name").fill(name);
  await form.getByLabel("Notes").fill("A private plan");
  await form.getByRole("button", { name: "Create project" }).click();
  const row = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name, exact: true }) });
  await expect(row).toContainText("A private plan");
  await page.reload();
  await expect(row).toBeVisible();
  await row.getByText("Edit project", { exact: true }).click();
  await expect(row.getByLabel("Project name")).toHaveValue(name);
  await row.getByLabel("Project name").fill(`${name} updated`);
  await row.getByRole("button", { name: "Save changes" }).click();
  const updated = page.getByRole("listitem").filter({
    has: page.getByRole("heading", { name: `${name} updated`, exact: true }),
  });
  await expect(updated).toBeVisible();
  await updated.getByRole("button", { name: "Delete project" }).click();
  await expect(
    page.getByRole("heading", { name: `${name} updated`, exact: true }),
  ).toHaveCount(0);
});
