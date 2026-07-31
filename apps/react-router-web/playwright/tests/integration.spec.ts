import { expect, test } from "@playwright/test";
import { testUser } from "../fixtures/test-user";
import { LoginPage } from "../pages/login-page";
import { TestPage } from "../pages/test-page";

test("shows a toast after login on the authenticated example route", async ({
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
  await testPage.triggerToast();

  await expect(page.getByText("My first toast")).toBeVisible();
});
