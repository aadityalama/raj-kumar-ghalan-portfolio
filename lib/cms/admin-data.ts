import { requireAdmin } from "@/lib/cms/admin-auth";
import { fallbackPortfolio } from "@/lib/cms/defaults";
import type {
  ContactRow,
  ExperienceRow,
  GalleryRow,
  ProjectRow,
  SectionRow,
  SeoRow,
  SettingsRow,
  SkillRow,
  SocialRow,
} from "@/lib/cms/types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminDashboard() {
  const user = await requireAdmin();
  const empty = {
    projects: 0,
    photos: 0,
    skills: 0,
    sections: 0,
    source: "fallback" as const,
    configured: false,
    cmsReady: false,
    adminGranted: false,
    recent: [] as Array<{ label: string; at: string }>,
  };
  if (!hasSupabaseEnv()) return empty;

  const supabase = await createSupabaseServerClient();
  const [projects, photos, skills, sections, settings, contact, seo, adminRow] = await Promise.all([
    supabase.from("portfolio_projects").select("id,title,updated_at", { count: "exact" }),
    supabase.from("portfolio_gallery").select("id,title,updated_at", { count: "exact" }),
    supabase.from("portfolio_skills").select("id,name,updated_at", { count: "exact" }),
    supabase.from("portfolio_sections").select("id,label,updated_at", { count: "exact" }),
    supabase.from("portfolio_settings").select("updated_at").eq("id", 1).maybeSingle(),
    supabase.from("portfolio_contact").select("updated_at").eq("id", 1).maybeSingle(),
    supabase.from("portfolio_seo").select("updated_at").eq("id", 1).maybeSingle(),
    supabase.from("portfolio_admins").select("user_id").eq("user_id", user.id).maybeSingle(),
  ]);

  const recent = [
    ...(projects.data || []).map((item) => ({ label: `Project · ${item.title}`, at: item.updated_at || "" })),
    ...(photos.data || []).map((item) => ({ label: `Photo · ${item.title}`, at: item.updated_at || "" })),
    ...(skills.data || []).map((item) => ({ label: `Skill · ${item.name}`, at: item.updated_at || "" })),
    ...(sections.data || []).map((item) => ({ label: `Section · ${item.label}`, at: item.updated_at || "" })),
    ...(settings.data?.updated_at ? [{ label: "Website content", at: settings.data.updated_at }] : []),
    ...(contact.data?.updated_at ? [{ label: "Contact", at: contact.data.updated_at }] : []),
    ...(seo.data?.updated_at ? [{ label: "SEO", at: seo.data.updated_at }] : []),
  ]
    .filter((item) => item.at)
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  return {
    projects: projects.count || 0,
    photos: photos.count || 0,
    skills: skills.count || 0,
    sections: sections.count || 0,
    source: "cms" as const,
    configured: true,
    cmsReady: Boolean(settings.data) && !settings.error,
    adminGranted: Boolean(adminRow.data) && !adminRow.error,
    recent,
  };
}

export async function getAdminCollections() {
  await requireAdmin();
  const fallback = fallbackPortfolio();
  if (!hasSupabaseEnv()) {
    return {
      settings: fallback.settings,
      sections: fallback.sections,
      gallery: fallback.gallery,
      projects: fallback.projects,
      experience: fallback.experience,
      skills: fallback.skills,
      socials: fallback.socials,
      contact: fallback.contact,
      seo: fallback.seo,
      configured: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const [settings, sections, gallery, projects, experience, skills, socials, contact, seo] = await Promise.all([
    supabase.from("portfolio_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("portfolio_sections").select("*").order("sort_order"),
    supabase.from("portfolio_gallery").select("*").order("sort_order"),
    supabase.from("portfolio_projects").select("*").order("sort_order"),
    supabase.from("portfolio_experience").select("*").order("sort_order"),
    supabase.from("portfolio_skills").select("*").order("sort_order"),
    supabase.from("portfolio_social_links").select("*").order("sort_order"),
    supabase.from("portfolio_contact").select("*").eq("id", 1).maybeSingle(),
    supabase.from("portfolio_seo").select("*").eq("id", 1).maybeSingle(),
  ]);

  return {
    settings: (settings.data as SettingsRow) || fallback.settings,
    sections: (sections.data as SectionRow[]) || fallback.sections,
    gallery: (gallery.data as GalleryRow[]) || fallback.gallery,
    projects: (projects.data as ProjectRow[]) || fallback.projects,
    experience: (experience.data as ExperienceRow[]) || fallback.experience,
    skills: (skills.data as SkillRow[]) || fallback.skills,
    socials: (socials.data as SocialRow[]) || fallback.socials,
    contact: (contact.data as ContactRow) || fallback.contact,
    seo: (seo.data as SeoRow) || fallback.seo,
    configured: true,
  };
}
