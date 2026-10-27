import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("..", import.meta.url));
const directory = mkdtempSync(join(tmpdir(), "starter-compose-"));
const envFile = join(directory, "empty.env");
writeFileSync(envFile, "");
const args = [
  "compose",
  "--env-file",
  envFile,
  "-p",
  `starter-proof-${process.pid}`,
];
const env = {
  ...process.env,
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY: "local-compose-placeholder",
  API_HOST: "http://localhost:3001",
  JAVA_API_HOST: "http://java-api:8080",
};
function compose(command, capture = false) {
  return execFileSync("docker", [...args, ...command], {
    cwd,
    env,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
  });
}
async function response(url, options) {
  const result = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(result.status, 200, `${url} must return 200`);
  return result;
}

try {
  compose(["up", "--build", "--detach", "--wait", "--wait-timeout", "180"]);
  for (const service of ["web", "api", "react-router-web", "java-api"]) {
    assert.notEqual(
      compose(["exec", "-T", service, "id", "-u"], true).trim(),
      "0",
      `${service} must run as non-root`,
    );
  }
  await response("http://127.0.0.1:3000/");
  await response("http://127.0.0.1:8080/");
  assert.deepEqual(
    await (await response("http://127.0.0.1:3001/status")).json(),
    { ok: true },
  );
  assert.equal(
    await (
      await response("http://127.0.0.1:8080/resources/healthcheck")
    ).text(),
    "OK",
  );
  assert.equal(
    (await (await response("http://127.0.0.1:8081/actutaor/health")).json())
      .status,
    "UP",
  );
  const item = await (
    await response("http://127.0.0.1:8081/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Compose contract" }),
    })
  ).json();
  assert.ok(item.id, "Spring must persist the sample item");
  assert.match(
    await (await response("http://127.0.0.1:8080/items")).text(),
    /Compose contract/,
    "React Router must load the Spring item",
  );
  const greeting = compose(
    [
      "exec",
      "-T",
      "web",
      "node",
      "-e",
      "fetch('http://api:3001/message/Starter').then(async r => { if (!r.ok) process.exit(1); console.log(await r.text()) }).catch(() => process.exit(1))",
    ],
    true,
  );
  assert.equal(
    JSON.parse(greeting).message,
    "hello Starter",
    "Next's container must reach Express",
  );
  for (const [url, destination] of [
    ["http://127.0.0.1:3000/protected", "/auth/login"],
    ["http://127.0.0.1:8080/projects", "/login"],
  ]) {
    const result = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });
    assert.ok(
      result.status >= 300 && result.status < 400,
      `${url} must redirect unauthenticated users`,
    );
    assert.equal(
      new URL(result.headers.get("Location"), url).pathname,
      destination,
    );
  }
  console.log(
    "PASS: four healthy non-root services, frontend/backend connectivity, and auth redirects.",
  );
} catch (error) {
  try {
    compose(["logs", "--tail", "60"]);
  } catch {
    /* Preserve the original failure. */
  }
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  try {
    compose(["down", "--remove-orphans"]);
  } catch {
    process.exitCode = 1;
  }
  rmSync(directory, { recursive: true, force: true });
}
