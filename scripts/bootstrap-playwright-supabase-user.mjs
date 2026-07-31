import { execFileSync } from "node:child_process";
import { getLocalSupabaseEnv } from "./lib/supabase-local-env.mjs";

const TEST_USER = {
  email: process.env.PLAYWRIGHT_TEST_EMAIL ?? "playwright@example.com",
  password:
    process.env.PLAYWRIGHT_TEST_PASSWORD ?? "playwright-password-123",
  username: process.env.PLAYWRIGHT_TEST_USERNAME ?? "playwright-user",
  fullName: process.env.PLAYWRIGHT_TEST_FULL_NAME ?? "Playwright User",
  avatarUrl:
    process.env.PLAYWRIGHT_TEST_AVATAR_URL ??
    "https://example.com/playwright-avatar.png",
};

async function listUsers(url, serviceRoleKey) {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const response = await fetch(
      `${url}/auth/v1/admin/users?page=${page}&per_page=${perPage}`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to list auth users: ${response.status}`);
    }

    const payload = await response.json();
    const batch = payload.users ?? [];
    users.push(...batch);

    if (batch.length < perPage) break;
    page += 1;
  }

  return users;
}

async function createUser(url, serviceRoleKey) {
  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
      user_metadata: {
        full_name: TEST_USER.fullName,
        email_verified: true,
        avatar_url: TEST_USER.avatarUrl,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to create auth user: ${response.status} ${body}`);
  }

  const payload = await response.json();
  return payload.user ?? payload;
}

async function updateUser(url, serviceRoleKey, userId) {
  const response = await fetch(`${url}/auth/v1/admin/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      email: TEST_USER.email,
      password: TEST_USER.password,
      user_metadata: {
        full_name: TEST_USER.fullName,
        email_verified: true,
        avatar_url: TEST_USER.avatarUrl,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to update auth user: ${response.status} ${body}`);
  }

  const payload = await response.json();
  return payload.user ?? payload;
}

function escapeSqlLiteral(value) {
  return value.replaceAll("'", "''");
}

function upsertProfile(dbUrl, userId) {
  const sql = `
    grant select, insert, update on table public.profiles to authenticated;

    insert into public.profiles (id, username, avatar_url, website, updated_at)
    values (
      '${escapeSqlLiteral(userId)}',
      '${escapeSqlLiteral(TEST_USER.username)}',
      '${escapeSqlLiteral(TEST_USER.avatarUrl)}',
      'https://example.com/playwright',
      now()
    )
    on conflict (id)
    do update set
      username = excluded.username,
      avatar_url = excluded.avatar_url,
      website = excluded.website,
      updated_at = excluded.updated_at;
  `;

  execFileSync("psql", [dbUrl, "-v", "ON_ERROR_STOP=1", "-c", sql], {
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
  });
}

async function main() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL } =
    getLocalSupabaseEnv();
  const users = await listUsers(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const existingUser = users.find((user) => user.email === TEST_USER.email);
  const user = existingUser
    ? await updateUser(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        existingUser.id,
      )
    : await createUser(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  upsertProfile(SUPABASE_DB_URL, user.id);

  console.log(
    `Playwright Supabase user is ready: ${TEST_USER.email} (${user.id})`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
