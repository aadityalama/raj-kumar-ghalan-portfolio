import { redirect } from "next/navigation";
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
