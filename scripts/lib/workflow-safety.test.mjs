import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

test("repository workflows cannot reset remote databases or commit raw backups", () => {
  const directory = new URL("../../.github/workflows/", import.meta.url);
  for (const name of readdirSync(directory).filter((name) =>
    /\.ya?ml$/.test(name),
  )) {
    const source = readFileSync(new URL(name, directory), "utf8");
    assert.doesNotMatch(
      source,
      /supabase\s+db\s+reset/,
      `${name} must not reset databases`,
    );
    assert.doesNotMatch(
      source,
      /supabase\s+db\s+dump/,
      `${name} must not export private database contents into a checkout`,
    );
  }
});
