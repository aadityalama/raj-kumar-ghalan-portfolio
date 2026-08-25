import { DESIGNATED_ADMIN_EMAIL } from "@/config/admin";

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

/**
 * Server-only admin allowlist.
 * Prefer ADMIN_EMAIL from the host environment (Hostinger → Environment variables).
 * Never prefix ADMIN_EMAIL with NEXT_PUBLIC_. Never put passwords or service-role keys here.
 *
 * Falls back to DESIGNATED_ADMIN_EMAIL when set (legacy single-admin installs).
 */
export function adminEmail() {
  const fromEnv = process.env["ADMIN_EMAIL"]?.trim().toLowerCase() || "";
  if (fromEnv) return fromEnv;
  const designated = DESIGNATED_ADMIN_EMAIL.trim().toLowerCase();
  return designated || "";
}

/** True when an admin allowlist email is available (env or designated fallback). */
export function hasAdminEmail() {
  return Boolean(adminEmail());
}
