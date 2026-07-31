export const testUser = {
  email: process.env.PLAYWRIGHT_TEST_EMAIL ?? "playwright@example.com",
  password:
    process.env.PLAYWRIGHT_TEST_PASSWORD ?? "playwright-password-123",
  username: process.env.PLAYWRIGHT_TEST_USERNAME ?? "playwright-user",
  fullName: process.env.PLAYWRIGHT_TEST_FULL_NAME ?? "Playwright User",
  avatarUrl:
    process.env.PLAYWRIGHT_TEST_AVATAR_URL ??
    "https://example.com/playwright-avatar.png",
};
