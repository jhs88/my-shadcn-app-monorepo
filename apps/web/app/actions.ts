"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchProfileName() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.error(error ?? "Error finding User!");
    // throw error ?? Error("Error finding User!");
    return;
  }

  return data.user.user_metadata.full_name ?? data.user.email;
}

export async function fetchProfileImage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.error(error ?? "Error finding User!");
    // throw error ?? Error("Error finding User!");
    return;
  }

  return data.user.user_metadata.avatar_url;
}
