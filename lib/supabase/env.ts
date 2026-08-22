function publicSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    ""
  );
}

export function hasSupabaseEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && publicSupabaseKey());
}

export function requireSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = publicSupabaseKey();
  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return { url, anonKey };
}

/** Server-only allowlist. Never prefix ADMIN_EMAIL with NEXT_PUBLIC_. */
export function adminEmail() {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
}
