"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { MEDIA_BUCKET, profileStoragePathFromUrl, storageObjectPath, validateImageFile } from "@/lib/cms/media";
import { adminEmail, hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function refreshPublic() {
  revalidatePath("/", "layout");
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

  if (!allowed) {
    return {
      error:
        "Admin access is not configured. Set server-only ADMIN_EMAIL on the host to the designated Auth user email.",
    };
  }
  if (!email || !password) return { error: "Email and password are required." };
  if (email !== allowed) return { error: "This account is not authorized for admin access." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid login." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || user.email.toLowerCase() !== allowed) {
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
  const user = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) redirect("/admin");
  return supabase;
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

export async function saveSettingsAction(formData: FormData) {
  const supabase = await adminClient();
  const { data: current } = await supabase.from("portfolio_settings").select("*").eq("id", 1).maybeSingle();
  const payload: Record<string, string | number> = { id: 1, ...(current || {}) };

  for (const key of SETTINGS_FIELDS) {
    if (formData.has(key)) payload[key] = String(formData.get(key) || "");
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

  const { error } = await supabase.from("portfolio_settings").upsert(payload);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteHeroImageAction() {
  const supabase = await adminClient();
  const { data: current, error: readError } = await supabase
    .from("portfolio_settings")
    .select("hero_image_url")
    .eq("id", 1)
    .maybeSingle();

  if (readError) return { error: readError.message };
  if (!current?.hero_image_url) return { error: "No profile photo to remove." };

  const storagePath = profileStoragePathFromUrl(current.hero_image_url);

  const { error } = await supabase.from("portfolio_settings").update({ hero_image_url: "" }).eq("id", 1);
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
  const supabase = await adminClient();
  const payload = {
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    location: String(formData.get("location") || ""),
    message: String(formData.get("message") || ""),
  };
  const { error } = await supabase.from("portfolio_contact").upsert({ id: 1, ...payload });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSeoAction(formData: FormData) {
  const supabase = await adminClient();
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
  const payload = {
    site_title: String(formData.get("site_title") || ""),
    meta_description: String(formData.get("meta_description") || ""),
    keywords,
    og_title: String(formData.get("og_title") || ""),
    og_description: String(formData.get("og_description") || ""),
    og_image: ogImage,
  };
  const { error } = await supabase.from("portfolio_seo").upsert({ id: 1, ...payload });
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSectionAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const { error } = await supabase
    .from("portfolio_sections")
    .update({
      label: String(formData.get("label") || ""),
      href: String(formData.get("href") || ""),
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") || 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSocialAction(formData: FormData) {
  const supabase = await adminClient();
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
    ? supabase.from("portfolio_social_links").update(payload).eq("id", id)
    : supabase.from("portfolio_social_links").insert(payload);
  const { error } = await query;
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteSocialAction(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("portfolio_social_links").delete().eq("id", String(formData.get("id") || ""));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

async function uploadPublicImage(kind: "gallery" | "projects" | "profile" | "social", file: File) {
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
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const files = formData.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  const single = formData.get("file");
  if (single instanceof File && single.size > 0) files.push(single);

  if (!id && files.length > 1) {
    const { data: last } = await supabase
      .from("portfolio_gallery")
      .select("sort_order")
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
      const { error } = await supabase.from("portfolio_gallery").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        description: String(formData.get("description") || ""),
        category: String(formData.get("category") || "Personal"),
        image_path: uploaded.path,
        image_url: uploaded.url,
        featured: false,
        visible: true,
        sort_order: order,
      });
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
    await supabase.from("portfolio_gallery").update({ featured: false }).neq("id", id || "00000000-0000-0000-0000-000000000000");
  }

  const { error } = id
    ? await supabase.from("portfolio_gallery").update(payload).eq("id", id)
    : await supabase.from("portfolio_gallery").insert(payload);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteGalleryAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const path = String(formData.get("image_path") || "");
  const { error } = await supabase.from("portfolio_gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  refreshPublic();
  return { ok: true };
}

export async function saveProjectAction(formData: FormData) {
  const supabase = await adminClient();
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
    ? await supabase.from("portfolio_projects").update(payload).eq("id", id)
    : await supabase.from("portfolio_projects").insert(payload);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteProjectAction(formData: FormData) {
  const supabase = await adminClient();
  const path = String(formData.get("image_path") || "");
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", String(formData.get("id") || ""));
  if (error) return { error: error.message };
  if (path) await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  refreshPublic();
  return { ok: true };
}

export async function saveExperienceAction(formData: FormData) {
  const supabase = await adminClient();
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
    ? await supabase.from("portfolio_experience").update(payload).eq("id", id)
    : await supabase.from("portfolio_experience").insert(payload);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteExperienceAction(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("portfolio_experience").delete().eq("id", String(formData.get("id") || ""));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function saveSkillAction(formData: FormData) {
  const supabase = await adminClient();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || ""),
    level: String(formData.get("level") || ""),
    visible: formData.get("visible") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };
  const { error } = id
    ? await supabase.from("portfolio_skills").update(payload).eq("id", id)
    : await supabase.from("portfolio_skills").insert(payload);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function deleteSkillAction(formData: FormData) {
  const supabase = await adminClient();
  const { error } = await supabase.from("portfolio_skills").delete().eq("id", String(formData.get("id") || ""));
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}

export async function moveRowAction(formData: FormData) {
  const supabase = await adminClient();
  const table = String(formData.get("table") || "");
  const allowed = [
    "portfolio_gallery",
    "portfolio_projects",
    "portfolio_experience",
    "portfolio_skills",
    "portfolio_sections",
    "portfolio_social_links",
  ];
  if (!allowed.includes(table)) return { error: "Invalid table." };
  const id = String(formData.get("id") || "");
  const sortOrder = Number(formData.get("sort_order") || 0);
  const { error } = await supabase.from(table).update({ sort_order: sortOrder }).eq("id", id);
  if (error) return { error: error.message };
  refreshPublic();
  return { ok: true };
}
