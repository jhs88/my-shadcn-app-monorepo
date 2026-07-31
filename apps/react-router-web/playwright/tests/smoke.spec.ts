import { expect, test } from "@playwright/test";
import { testUser } from "../fixtures/test-user";
import { LoginPage } from "../pages/login-page";
import { TestPage } from "../pages/test-page";

test("login, inspect profile, logout, and block protected revisit", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const testPage = new TestPage(page);

  await loginPage.goto();
  await loginPage.login({
    email: testUser.email,
    password: testUser.password,
  });

  await page.waitForURL("**/test");
  await testPage.expectLoaded();
  await testPage.openProfileDialog();
  await testPage.expectProfile({
    email: testUser.email,
    username: testUser.username,
    verifiedText: "yes",
    avatarUrl: testUser.avatarUrl,
  });
  await testPage.closeProfileDialog();

  await testPage.logout();
  await page.waitForURL("**/");

  await page.goto("/test");
  await page.waitForURL("**/login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
});
