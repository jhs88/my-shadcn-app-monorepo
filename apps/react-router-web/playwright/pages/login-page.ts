import { expect, type Page } from "@playwright/test";

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/login");
    await expect(this.page.getByRole("heading", { name: "Login" })).toBeVisible();
  }

  async login(input: { email: string; password: string }) {
    await this.page.getByLabel("Email").fill(input.email);
    await this.page.getByLabel("Password").fill(input.password);
    await this.page.getByRole("button", { name: "Login" }).click();
  }
}
