import { expect, type Page } from "@playwright/test";

export class TestPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(
      this.page.getByRole("button", { name: "Open profile dialog" }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("button", { name: "Give me a toast" }),
    ).toBeVisible();
  }

  async openProfileDialog() {
    await this.page.getByRole("button", { name: "Open profile dialog" }).click();
    await expect(
      this.page.getByRole("heading", { name: "My Profile Info" }),
    ).toBeVisible();
  }

  async expectProfile(input: {
    email: string;
    username: string;
    verifiedText: string;
    avatarUrl: string;
  }) {
    await expect(this.page.getByText(input.email)).toBeVisible();
    await expect(this.page.getByText(input.username)).toBeVisible();
    await expect(this.page.getByText(input.verifiedText)).toBeVisible();
    await expect(this.page.getByAltText("Profile avatar")).toHaveAttribute(
      "src",
      input.avatarUrl,
    );
  }

  async closeProfileDialog() {
    await this.page.getByRole("button", { name: "Close" }).click();
    await expect(
      this.page.getByRole("heading", { name: "My Profile Info" }),
    ).not.toBeVisible();
  }

  async triggerToast() {
    await this.page.getByRole("button", { name: "Give me a toast" }).click();
  }

  async logout() {
    await this.page.getByRole("link", { name: "Logout" }).click();
  }
}
