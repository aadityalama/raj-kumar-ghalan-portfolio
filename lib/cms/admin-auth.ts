import { redirect } from "next/navigation";
import { getCurrentSite, isLegacySiteId } from "@/lib/cms/site";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminUser() {
  if (!hasSupabaseEnv()) return null;
  const allowed = adminEmail();
  if (!allowed) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  if (user.email.toLowerCase() !== allowed) {
    return null;
  }

  return user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * Ensure the signed-in admin is a member of the current site (or legacy portfolio_admins).
 * Does not rely on localStorage for authorization.
 */
export async function requireSiteEditor() {
  const user = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const site = await getCurrentSite();

  try {
    const { data: legacyAdmin } = await supabase
      .from("portfolio_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (legacyAdmin) {
      return { user, supabase, site, siteId: isLegacySiteId(site?.id) ? null : site?.id || null };
    }

    if (site && !isLegacySiteId(site.id)) {
      const { data: membership } = await supabase
        .from("portfolio_site_members")
        .select("site_id, role")
        .eq("site_id", site.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (membership) {
        return { user, supabase, site, siteId: site.id };
      }
    }
  } catch {
    // Tables from later migrations may be missing on partially upgraded projects.
  }

  redirect("/admin");
}
