import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("..", import.meta.url));
const source = execFileSync(
  "supabase",
  ["gen", "types", "typescript", "--local"],
  {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  },
);
// Normalize the CLI's whitespace without depending on a formatter version.
const normalized = source
  .split("\n")
  .map((line) => line.trimEnd())
  .join("\n");
writeFileSync(
  new URL("../packages/types/database.types.ts", import.meta.url),
  normalized,
);
