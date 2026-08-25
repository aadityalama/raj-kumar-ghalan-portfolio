import { redirect } from "next/navigation";
import { assertSiteId, resolveAdminSite, resolvePublicSite } from "@/lib/cms/site";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const email = user.email.toLowerCase();
  const allowed = adminEmail();

  // Single-tenant Hostinger allowlist (owner/customer deploy).
  if (allowed && email === allowed) return user;

  // Shared-DB multi-tenant: any portfolio_admins member may access admin for their own site.
  const { data: adminRow } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminRow) return user;
  return null;
}

/** True when the signed-in user may use /admin/login (env allowlist or portfolio_admins). */
export async function isAuthorizedAdminEmail(email: string, userId?: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;

  const allowed = adminEmail();
  if (allowed && normalized === allowed) return true;

  if (!hasSupabaseEnv() || !userId) return false;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Resolve the editable site from the authenticated user (never from client site_id).
 * Owner admins keep the owner site; other admins get an isolated customer site.
 */
export async function requireSiteEditor() {
  const user = await requireAdmin();
  const supabase = await createSupabaseServerClient();

  try {
    const site = await resolveAdminSite(user);
    assertSiteId(site.id);

    // Ensure membership for the resolved site (server-side only; never trust client site_id).
    const { error: memberError } = await supabase.from("portfolio_site_members").upsert({
      site_id: site.id,
      user_id: user.id,
      role: "owner",
    });
    if (memberError) {
      // Membership may already exist; RLS may block duplicate paths — re-check.
      const { data: membership } = await supabase
        .from("portfolio_site_members")
        .select("site_id")
        .eq("site_id", site.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!membership) redirect("/admin/login");
    }

    return { user, supabase, site, siteId: site.id as string };
  } catch {
    redirect("/admin/login");
  }
}

/** Public site for rendering — host/domain first, never a client site_id. */
export async function requirePublicSiteId() {
  const site = await resolvePublicSite();
  if (!site?.id) {
    throw new Error("Could not resolve a public portfolio site.");
  }
  return site.id;
}
