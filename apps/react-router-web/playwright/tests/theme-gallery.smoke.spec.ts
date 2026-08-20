import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

// Reads the six theme definitions straight from @repo/ui so the spec always
// tracks the source of truth: setting data-theme on <html> must apply that
// theme's tokens (asserted via the verbatim custom-property value).
const themesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/ui/src/styles/themes",
);

const themes = readdirSync(themesDir)
  .filter((file) => file.endsWith(".css"))
  .map((file) => {
    const css = readFileSync(join(themesDir, file), "utf8");
    const name = file.replace(/\.css$/, "");
    const lightBlock = css.match(
      new RegExp(`\\[data-theme="${name}"\\]\\s*\\{([^}]*)\\}`),
    );
    const background = lightBlock?.[1]?.match(/--background:\s*([^;]+);/);
    if (!background?.[1]) {
      throw new Error(`No light --background found in theme file ${file}`);
    }
    return { name, background: background[1].trim() };
  });

test("gallery renders under every theme", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  await page.goto("/gallery");
  await expect(page).toHaveURL(/\/gallery/);

  for (const theme of themes) {
    await page.evaluate(
      (name) => document.documentElement.setAttribute("data-theme", name),
      theme.name,
    );
    const applied = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim(),
    );
    expect(
      applied,
      `theme "${theme.name}" should apply its --background token`,
    ).toBe(theme.background);
  }

  expect(pageErrors, "no page errors across all themes").toEqual([]);
});
