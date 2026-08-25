"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSiteEditor } from "@/lib/cms/admin-auth";
import { sanitizeAccentColor } from "@/lib/cms/branding";
import { MEDIA_BUCKET, profileStoragePathFromUrl, storageObjectPath, validateImageFile } from "@/lib/cms/media";
import {
  assertBrandColumns,
  getPortfolioSettingsColumns,
  isMissingColumnError,
  migrationHintForMissingColumn,
  pickSettingsPayload,
} from "@/lib/cms/settings-schema";
import { assertSiteId } from "@/lib/cms/site";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function refreshPublic() {
  revalidatePath("/", "layout");
  revalidatePath("/gallery", "page");
  revalidatePath("/admin", "layout");
}

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  if (!hasSupabaseEnv()) {
    return { error: "Supabase is not configured. Add the environment variables first." };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const allowed = adminEmail();

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid login." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  const userEmail = user.email.toLowerCase();
  let authorized = Boolean(allowed && userEmail === allowed);
  if (!authorized) {
    const { data: adminRow } = await supabase
      .from("portfolio_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    authorized = Boolean(adminRow);
  }

  if (!authorized) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

async function adminClient() {
  const { supabase, siteId } = await requireSiteEditor();
  assertSiteId(siteId);
  return { supabase, siteId };
}

/** Always attach server-resolved site_id. Never accept client-provided site_id. */
function withSite<T extends Record<string, unknown>>(payload: T, siteId: string) {
  assertSiteId(siteId);
  const rest = { ...payload } as T & { site_id?: unknown };
  delete rest.site_id;
  return { ...rest, site_id: siteId };
}

function updateOwnedRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  siteId: string,
  id: string,
  payload: Record<string, unknown>,
) {
  assertSiteId(siteId);
  // Dynamic table name — cast keeps PostgREST builder chaining typed loosely.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.from(table) as any).update(payload).eq("id", id).eq("site_id", siteId);
}

function deleteOwnedRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  siteId: string,
  id: string,
) {
  assertSiteId(siteId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.from(table) as any).delete().eq("id", id).eq("site_id", siteId);
}

const SETTINGS_FIELDS = [
  "hero_title",
  "hero_subtitle",
  "hero_positioning",
  "hero_body",
  "hero_image_url",
  "about_title",
  "about_body",
  "about_body_secondary",
  "about_experience_label",
  "journey_title",
  "journey_description",
  "philosophy",
  "content_title",
  "content_description",
  "content_youtube_title",
  "content_youtube_body",
  "market_title",
  "market_description",
  "market_profile",
  "market_note",
  "market_followers",
  "market_posts",
  "market_facebook_url",
] as const;

const BRAND_FIELDS = [
  "website_name",
  "brand_name",
  "wordmark",
  "logo_url",
  "favicon_url",
  "copyright_text",
  "site_url",
] as const;

async function readSettingsRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  siteId: string,
) {
  assertSiteId(siteId);
  return supabase.from("portfolio_settings").select("*").eq("site_id", siteId).maybeSingle();
}

async function upsertSettingsRow(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  siteId: string,
  payload: Record<string, unknown>,
) {
  assertSiteId(siteId);
  const columns = await getPortfolioSettingsColumns();
  if (!columns.has("site_id")) {
    return {
      error:
        "Database is missing site_id isolation. Apply supabase/migrations/007_productize_multitenant.sql and 009_site_isolation.sql, then reload the API schema.",
    };
  }

  const filtered = pickSettingsPayload(withSite({ ...payload }, siteId), columns);
  // Never force singleton id=1 — one settings row per site_id.
  delete filtered.id;

  const { error } = await supabase
    .from("portfolio_settings")
    .upsert(filtered, { onConflict: "site_id" });
  if (!error) return { ok: true as const };

  if (isMissingColumnError(error.message)) {
    return { error: migrationHintForMissingColumn() };
  }
  return { error: error.message };
}

export async function saveSettingsAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const { data: current } = await readSettingsRow(supabase, siteId);
  const payload: Record<string, string | number | boolean> = {};

  for (const key of SETTINGS_FIELDS) {
    if (formData.has(key)) payload[key] = String(formData.get(key) || "");
    else if (current && current[key] != null) payload[key] = current[key] as string;
  }

  const heroFile = formData.get("hero_image");
  if (heroFile instanceof File && heroFile.size > 0) {
    try {
      const uploaded = await uploadPublicImage("profile", heroFile);
      const previousPath = profileStoragePathFromUrl(String(current?.hero_image_url || ""));
      payload.hero_image_url = uploaded.url;
      if (previousPath && previousPath !== uploaded.path) {
        await supabase.storage.from(MEDIA_BUCKET).remove([previousPath]);
      }
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }

  const result = await upsertSettingsRow(supabase, siteId, payload);
  if (result.error) return { error: result.error };
  refreshPublic();
  return { ok: true };
}

export async function saveBrandSettingsAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const columns = await getPortfolioSettingsColumns();
  const missing = assertBrandColumns(columns);
  if (missing) return { error: missing };

  const { data: current } = await readSettingsRow(supabase, siteId);
  const payload: Record<string, string | number | boolean> = {};

  for (const key of SETTINGS_FIELDS) {
    if (current && current[key] != null) payload[key] = current[key] as string;
  }

  for (const key of BRAND_FIELDS) {
    if (formData.has(key)) payload[key] = String(formData.get(key) || "");
    else if (current && current[key] != null) payload[key] = current[key] as string;
  }

  if (formData.has("accent_color")) {
    payload.accent_color = sanitizeAccentColor(String(formData.get("accent_color") || ""));
  } else if (current?.accent_color) {
    payload.accent_color = String(current.accent_color);
  }

  const theme = String(formData.get("theme_preference") || current?.theme_preference || "dark");
  payload.theme_preference = ["dark", "light", "system"].includes(theme) ? theme : "dark";

  // Keep public hero title aligned with the person/brand name customers edit here.
  if (formData.has("brand_name")) {
    const brandName = String(formData.get("brand_name") || "").trim();
    if (brandName) payload.hero_title = brandName;
  }

  const logoFile = formData.get("logo_file");
  if (logoFile instanceof File && logoFile.size > 0) {
    try {
      const uploaded = await uploadPublicImage("brand", logoFile);
      payload.logo_url = uploaded.url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Logo upload failed." };
    }
  }

  const faviconFile = formData.get("favicon_file");
  if (faviconFile instanceof File && faviconFile.size > 0) {
    try {
      const uploaded = await uploadPublicImage("brand", faviconFile);
      payload.favicon_url = uploaded.url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Favicon upload failed." };
    }
  }

  const result = await upsertSettingsRow(supabase, siteId, payload);
  if (result.error) return { error: result.error };
  refreshPublic();
  return { ok: true };
}

export async function saveOnboardingAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const columns = await getPortfolioSettingsColumns();
  const step = String(formData.get("step") || "");
  const { data: current } = await readSettingsRow(supabase, siteId);

  const payload: Record<string, string | number | boolean> = {};

  // Preserve existing core fields so partial onboarding steps do not wipe content.
  for (const key of SETTINGS_FIELDS) {
    if (current && current[key] != null) payload[key] = current[key] as string;
  }
  for (const key of BRAND_FIELDS) {
    if (columns.has(key) && current && current[key] != null) {
      payload[key] = current[key] as string;
    }
  }

  if (formData.has("brand_name") || formData.has("hero_title") || formData.has("website_name")) {
    const brandMissing = assertBrandColumns(columns, ["brand_name", "website_name"]);
    if (brandMissing) return { error: brandMissing };

    const name = String(formData.get("brand_name") || formData.get("hero_title") || "").trim();
    const websiteName = String(formData.get("website_name") || name).trim();
    if (name) {
      payload.brand_name = name;
      payload.hero_title = name;
      payload.wordmark = String(formData.get("wordmark") || name.toUpperCase());
    }
    if (websiteName) {
      payload.website_name = websiteName;
    }
  }

  if (formData.has("hero_positioning")) {
    payload.hero_positioning = String(formData.get("hero_positioning") || "");
  }
  if (formData.has("hero_subtitle")) {
    payload.hero_subtitle = String(formData.get("hero_subtitle") || "");
  }
  if (formData.has("about_body")) {
    payload.about_body = String(formData.get("about_body") || "");
  }
  if (formData.has("accent_color")) {
    if (!columns.has("accent_color")) {
      return { error: migrationHintForMissingColumn("accent_color") };
    }
    payload.accent_color = sanitizeAccentColor(String(formData.get("accent_color") || ""));
  }
  if (formData.has("theme_preference")) {
    if (!columns.has("theme_preference")) {
      return { error: migrationHintForMissingColumn("theme_preference") };
    }
    const theme = String(formData.get("theme_preference") || "dark");
    payload.theme_preference = ["dark", "light", "system"].includes(theme) ? theme : "dark";
  }

  const heroFile = formData.get("hero_image");
  if (heroFile instanceof File && heroFile.size > 0) {
    try {
      const uploaded = await uploadPublicImage("profile", heroFile);
      payload.hero_image_url = uploaded.url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }

  if (step === "publish") {
    if (columns.has("onboarding_completed")) {
      payload.onboarding_completed = true;
    }
    await supabase
      .from("portfolio_sites")
      .update({
        onboarding_completed: true,
        name: String(payload.brand_name || payload.website_name || payload.hero_title || "Portfolio"),
      })
      .eq("id", siteId);
  }

  const result = await upsertSettingsRow(supabase, siteId, payload);
  if (result.error) return { error: result.error };

  // Optional first project during onboarding
  const projectTitle = String(formData.get("project_title") || "").trim();
  if (projectTitle) {
    await supabase.from("portfolio_projects").insert(
      withSite(
        {
          title: projectTitle,
          description: String(formData.get("project_description") || ""),
          category: String(formData.get("project_category") || ""),
          technologies: [],
          live_url: String(formData.get("project_url") || ""),
          featured: true,
          published: true,
          sort_order: 10,
        },
        siteId,
      ),
    );
  }

  // Optional social links
  for (const platform of ["linkedin", "github", "instagram", "youtube"] as const) {
    const href = String(formData.get(`social_${platform}`) || "").trim();
    if (!href) continue;
    await supabase.from("portfolio_social_links").insert(
      withSite(
        {
          platform,
          label: platform[0].toUpperCase() + platform.slice(1),
          href,
          note: "",
          visible: true,
          sort_order: 10,
        },
        siteId,
      ),
    );
  }

  refreshPublic();
  if (step === "publish") redirect("/admin?onboarding=done");
  return { ok: true, next: String(formData.get("next") || "") };
}

export async function deleteHeroImageAction() {
  const { supabase, siteId } = await adminClient();
  const { data: current, error: readError } = await supabase
    .from("portfolio_settings")
    .select("hero_image_url,id")
    .eq("site_id", siteId)
    .maybeSingle();

  if (readError) return { error: readError.message };
  if (!current?.hero_image_url) return { error: "No profile photo to remove." };

  const storagePath = profileStoragePathFromUrl(current.hero_image_url);

  const { error } = await supabase
    .from("portfolio_settings")
    .update({ hero_image_url: "" })
    .eq("site_id", siteId);
  if (error) return { error: error.message };

  if (storagePath) {
    const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);
    if (storageError) {
      refreshPublic();
      return {
        error: `Profile photo was cleared, but the storage file could not be deleted: ${storageError.message}`,
      };
    }
  }

  refreshPublic();
  return { ok: true };
}

export async function saveContactAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const payload = withSite(
    {
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      message: String(formData.get("message") || ""),
    },
    siteId,
  );
  const { error } = await supabase.from("portfolio_contact").upsert(payload, { onConflict: "site_id" });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSeoAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const keywords = String(formData.get("keywords") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  let ogImage = String(formData.get("og_image") || "");
  const file = formData.get("og_file");
  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadPublicImage("social", file);
      ogImage = uploaded.url;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }
  const payload = withSite(
    {
      site_title: String(formData.get("site_title") || ""),
      meta_description: String(formData.get("meta_description") || ""),
      keywords,
      og_title: String(formData.get("og_title") || ""),
      og_description: String(formData.get("og_description") || ""),
      og_image: ogImage,
    },
    siteId,
  );
  const { error } = await supabase.from("portfolio_seo").upsert(payload, { onConflict: "site_id" });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSectionAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const { error } = await updateOwnedRow(supabase, "portfolio_sections", siteId, id, {
      label: String(formData.get("label") || ""),
      href: String(formData.get("href") || ""),
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSocialAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    platform: String(formData.get("platform") || ""),
    label: String(formData.get("label") || ""),
    href: String(formData.get("href") || ""),
    note: String(formData.get("note") || ""),
    visible: formData.get("visible") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  const query = id
    ? updateOwnedRow(supabase, "portfolio_social_links", siteId, id, payload)
    : supabase.from("portfolio_social_links").insert(withSite(payload, siteId));
  const { error } = await query;
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteSocialAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const { error } = await deleteOwnedRow(
    supabase,
    "portfolio_social_links",
    siteId,
    String(formData.get("id") || ""),
  );
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

async function uploadPublicImage(kind: "gallery" | "projects" | "product" | "profile" | "social" | "brand", file: File) {
  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);
  const supabase = await createSupabaseServerClient();
  const path = storageObjectPath(kind, file);
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function saveGalleryAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const files = formData.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  const single = formData.get("file");
  if (single instanceof File && single.size > 0) files.push(single);

  if (!id && files.length > 1) {
    const { data: last } = await supabase
      .from("portfolio_gallery")
      .select("sort_order")
      .eq("site_id", siteId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    let order = (last?.sort_order || 0) + 10;
    for (const file of files) {
      let uploaded;
      try {
        uploaded = await uploadPublicImage("gallery", file);
      } catch (error) {
        return { error: error instanceof Error ? error.message : "Image upload failed." };
      }
      const { error } = await supabase.from("portfolio_gallery").insert(withSite({
        title: file.name.replace(/\.[^.]+$/, ""),
        description: String(formData.get("description") || ""),
        category: String(formData.get("category") || "Personal"),
        image_path: uploaded.path,
        image_url: uploaded.url,
        featured: false,
        visible: true,
        sort_order: order,
      }, siteId));
      if (error) return { error: error.message };
      order += 10;
    }
    refreshPublic();
    return { ok: true };
  }

  let imageUrl = String(formData.get("image_url") || "");
  let imagePath = String(formData.get("image_path") || "") || null;
  if (files[0]) {
    try {
      const uploaded = await uploadPublicImage("gallery", files[0]);
      if (imagePath) await supabase.storage.from(MEDIA_BUCKET).remove([imagePath]);
      imageUrl = uploaded.url;
      imagePath = uploaded.path;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }
  if (!imageUrl) return { error: "A photo is required." };

  const payload = {
    title: String(formData.get("title") || "Untitled"),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || "Personal"),
    image_url: imageUrl,
    image_path: imagePath,
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };

  if (payload.featured) {
    await supabase
      .from("portfolio_gallery")
      .update({ featured: false })
      .eq("site_id", siteId)
      .neq("id", id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = id
    ? await updateOwnedRow(supabase, "portfolio_gallery", siteId, id, payload)
    : await supabase.from("portfolio_gallery").insert(withSite(payload, siteId));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteGalleryAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "");
  const { error } = await deleteOwnedRow(supabase, "portfolio_gallery", siteId, id);
  if (error) return { error: error.message };
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  refreshPublic();
  return { ok: true };
}

export async function saveProjectAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const file = formData.get("file");
  let imageUrl = String(formData.get("image_url") || "");
  let imagePath = String(formData.get("image_path") || "") || null;
  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadPublicImage("projects", file);
      if (imagePath) await supabase.storage.from(MEDIA_BUCKET).remove([imagePath]);
      imageUrl = uploaded.url;
      imagePath = uploaded.path;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }
  const payload = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    category: String(formData.get("category") || ""),
    technologies: String(formData.get("technologies") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    live_url: String(formData.get("live_url") || ""),
    github_url: String(formData.get("github_url") || ""),
    youtube_url: String(formData.get("youtube_url") || ""),
    image_url: imageUrl,
    image_path: imagePath,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  const { error } = id
    ? await updateOwnedRow(supabase, "portfolio_projects", siteId, id, payload)
    : await supabase.from("portfolio_projects").insert(withSite(payload, siteId));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteProjectAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const path = String(formData.get("image_path") || "");
  const { error } = await deleteOwnedRow(
    supabase,
    "portfolio_projects",
    siteId,
    String(formData.get("id") || ""),
  );
  if (error) return { error: error.message };
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  refreshPublic();
  return { ok: true };
}

export async function saveExperienceAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    company: String(formData.get("company") || ""),
    position: String(formData.get("position") || ""),
    start_year: String(formData.get("start_year") || ""),
    end_year: String(formData.get("end_year") || ""),
    description: String(formData.get("description") || ""),
    technologies: String(formData.get("technologies") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  const { error } = id
    ? await updateOwnedRow(supabase, "portfolio_experience", siteId, id, payload)
    : await supabase.from("portfolio_experience").insert(withSite(payload, siteId));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteExperienceAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const { error } = await deleteOwnedRow(
    supabase,
    "portfolio_experience",
    siteId,
    String(formData.get("id") || ""),
  );
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSkillAction(
  boundId: string | null,
  _prevState: { error?: string; ok?: boolean },
  formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
  const { supabase, siteId } = await adminClient();
  // Prefer the id bound into the action (edit forms). Fall back to the hidden
  // field so a plain form post still updates the correct row.
  const id = String(boundId || formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  if (!name || !category) {
    return { error: "Name and category are required." };
  }

  const payload = {
    name,
    category,
    level: String(formData.get("level") || ""),
    visible: formData.get("visible") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };

  if (id) {
    // UPDATE only — never insert when editing. .select() so a 0-row match
    // (bad id / RLS) surfaces as an error instead of a false "Saved."
    const { data, error } = await updateOwnedRow(supabase, "portfolio_skills", siteId, id, payload).select(
      "id",
    );
    if (error) return { error: error.message };
    if (!data?.length) {
      return { error: "Skill could not be updated. Refresh and try again." };
    }
  } else {
    const { error } = await supabase.from("portfolio_skills").insert(withSite(payload, siteId));
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/skills");
  refreshPublic();
  return { ok: true };
}

export async function deleteSkillAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const { error } = await deleteOwnedRow(
    supabase,
    "portfolio_skills",
    siteId,
    String(formData.get("id") || ""),
  );
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveProductSettingsAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const technologies = String(formData.get("technologies") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const payload = withSite(
    {
      section_title: String(formData.get("section_title") || "The Product").trim() || "The Product",
      case_title: String(formData.get("case_title") || ""),
      case_eyebrow: String(formData.get("case_eyebrow") || "Featured work"),
      live_url: String(formData.get("live_url") || ""),
      category: String(formData.get("category") || ""),
      short_description: String(formData.get("short_description") || ""),
      problem_title: String(formData.get("problem_title") || "The Problem"),
      problem_body: String(formData.get("problem_body") || ""),
      vision_title: String(formData.get("vision_title") || "The Vision"),
      vision_body: String(formData.get("vision_body") || ""),
      built_title: String(formData.get("built_title") || "What I Built"),
      built_body: String(formData.get("built_body") || ""),
      tech_title: String(formData.get("tech_title") || "Technology"),
      tech_body: String(formData.get("tech_body") || ""),
      philosophy_title: String(formData.get("philosophy_title") || "Product philosophy"),
      philosophy_body: String(formData.get("philosophy_body") || ""),
      technologies,
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    },
    siteId,
  );
  const { error } = await supabase
    .from("portfolio_product_settings")
    .upsert(payload, { onConflict: "site_id" });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveProductCardAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const file = formData.get("file");
  let imageUrl = String(formData.get("image_url") || "");
  let imagePath = String(formData.get("image_path") || "") || null;

  if (file instanceof File && file.size > 0) {
    try {
      const uploaded = await uploadPublicImage("product", file);
      if (imagePath) await supabase.storage.from(MEDIA_BUCKET).remove([imagePath]);
      imageUrl = uploaded.url;
      imagePath = uploaded.path;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Image upload failed." };
    }
  }

  const payload = {
      title: String(formData.get("title") || "").trim() || "Untitled",
      description: String(formData.get("description") || ""),
      category: String(formData.get("category") || ""),
      image_url: imageUrl,
      image_path: imagePath,
      link_url: String(formData.get("link_url") || "").trim(),
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    };

  const { error } = id
    ? await updateOwnedRow(supabase, "portfolio_product_cards", siteId, id, payload)
    : await supabase.from("portfolio_product_cards").insert(withSite(payload, siteId));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function removeProductCardImageAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "");
  if (!id) return { error: "Product card id is required." };

  const { error } = await updateOwnedRow(supabase, "portfolio_product_cards", siteId, id, {
    image_url: "",
    image_path: null,
  });
  if (error) return { error: error.message };

  if (path) {
    const { error: storageError } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    if (storageError) {
      refreshPublic();
      return {
        error: `Image was cleared, but the storage file could not be deleted: ${storageError.message}`,
      };
    }
  }

  refreshPublic();
  return { ok: true };
}

export async function deleteProductCardAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "");
  const { error } = await deleteOwnedRow(supabase, "portfolio_product_cards", siteId, id);
  if (error) return { error: error.message };
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  refreshPublic();
  return { ok: true };
}

export async function saveProductFeatureAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
      title: String(formData.get("title") || "").trim() || "Untitled",
      description: String(formData.get("description") || ""),
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    };
  const { error } = id
    ? await updateOwnedRow(supabase, "portfolio_product_features", siteId, id, payload)
    : await supabase.from("portfolio_product_features").insert(withSite(payload, siteId));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteProductFeatureAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const { error } = await deleteOwnedRow(
    supabase,
    "portfolio_product_features",
    siteId,
    String(formData.get("id") || ""),
  );
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function moveRowAction(formData: FormData) {
  const { supabase, siteId } = await adminClient();
  const table = String(formData.get("table") || "");
  const allowed = [
    "portfolio_gallery",
    "portfolio_projects",
    "portfolio_experience",
    "portfolio_skills",
    "portfolio_sections",
    "portfolio_social_links",
    "portfolio_product_cards",
    "portfolio_product_features",
  ];
  if (!allowed.includes(table)) return { error: "Invalid table." };
  const id = String(formData.get("id") || "");
  const sortOrder = Number(formData.get("sort_order") || 0);
  const { error } = await updateOwnedRow(supabase, table, siteId, id, { sort_order: sortOrder });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}
