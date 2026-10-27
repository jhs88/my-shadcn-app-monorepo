import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assertLocalSupabaseUrl,
  getLocalSupabaseEnv,
} from "./supabase-local-env.mjs";

test("local tooling rejects hosted projects even when explicit test credentials exist", () => {
  for (const url of [
    "https://project.supabase.co",
    "http://production.example.com",
    "http://localhost.example.com",
    "http://user:password@localhost:54321",
  ]) {
    assert.throws(() => assertLocalSupabaseUrl(url), /localhost/);
  }
  for (const url of [
    "http://127.0.0.1:54321",
    "http://localhost:54321",
    "http://[::1]:54321",
  ]) {
    assert.equal(assertLocalSupabaseUrl(url), url);
  }
});

test("explicit remote credentials are rejected before any user bootstrap can run", () => {
  const names = [
    "PLAYWRIGHT_SUPABASE_URL",
    "PLAYWRIGHT_SUPABASE_ANON_KEY",
    "PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY",
  ];
  const previous = names.map((name) => process.env[name]);
  try {
    process.env.PLAYWRIGHT_SUPABASE_URL = "https://remote.supabase.co";
    process.env.PLAYWRIGHT_SUPABASE_ANON_KEY = "test";
    process.env.PLAYWRIGHT_SUPABASE_SERVICE_ROLE_KEY = "test";
    assert.throws(() => getLocalSupabaseEnv(), /localhost/);
  } finally {
    names.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  }
});
