import { ActionForm } from "@/app/admin/_components/form-status";
import { saveBrandSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";
import { sanitizeAccentColor } from "@/lib/cms/branding";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const { settings, contact, configured } = await getAdminCollections();
  const accent = sanitizeAccentColor(settings.accent_color);

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Settings</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Manage site branding and identity. Accent color accepts hex values only — arbitrary CSS is not allowed.
      </p>
      {!configured ? (
        <p className="admin-notice mt-6 text-sm text-muted">
          Supabase is not configured. Showing demo defaults.
        </p>
      ) : null}

      <ActionForm action={saveBrandSettingsAction} className="admin-card mt-8 grid gap-4 p-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Website name
          <input
            className="admin-input"
            name="website_name"
            defaultValue={settings.website_name || settings.hero_title}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Person / brand name
          <input
            className="admin-input"
            name="brand_name"
            defaultValue={settings.brand_name || settings.hero_title}
          />
        </label>
        <label className="grid gap-2 text-sm sm:col-span-2">
          Wordmark (header / footer)
          <input
            className="admin-input"
            name="wordmark"
            defaultValue={settings.wordmark || (settings.hero_title || "").toUpperCase()}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Accent color (hex)
          <input className="admin-input" name="accent_color" defaultValue={accent} placeholder="#3DDC97" />
        </label>
        <label className="grid gap-2 text-sm">
          Theme preference
          <select
            className="admin-input"
            name="theme_preference"
            defaultValue={settings.theme_preference || "dark"}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm sm:col-span-2">
          Site URL / domain
          <input
            className="admin-input"
            name="site_url"
            defaultValue={settings.site_url || ""}
            placeholder="https://your-domain.com"
          />
        </label>
        <label className="grid gap-2 text-sm sm:col-span-2">
          Copyright text
          <input
            className="admin-input"
            name="copyright_text"
            defaultValue={settings.copyright_text || settings.brand_name || settings.hero_title}
          />
        </label>
        <label className="grid gap-2 text-sm sm:col-span-2">
          Logo image
          <input
            className="admin-input"
            type="file"
            name="logo_file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          {settings.logo_url ? (
            <span className="text-xs text-subtle">Current: {settings.logo_url}</span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm sm:col-span-2">
          Favicon image
          <input
            className="admin-input"
            type="file"
            name="favicon_file"
            accept="image/jpeg,image/png,image/webp,image/gif"
          />
          {settings.favicon_url ? (
            <span className="text-xs text-subtle">Current: {settings.favicon_url}</span>
          ) : null}
        </label>
        <p className="sm:col-span-2 text-xs text-subtle">
          Contact email, phone, and location are managed under Contact. Profile photo is managed under
          Homepage. Social links are managed under Social.
          {contact.email ? ` Current contact email: ${contact.email}.` : ""}
        </p>
      </ActionForm>
    </div>
  );
}
