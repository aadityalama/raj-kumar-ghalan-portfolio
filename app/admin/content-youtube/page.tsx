import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminContentYoutubePage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Content / YouTube</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit the content creator section, YouTube copy, themes, and channel CTAs. Social URLs are managed on the Social Links page.
      </p>

      <ActionForm action={saveSettingsAction} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm">
          Content eyebrow
          <input className="admin-input" name="content_eyebrow" defaultValue={settings.content_eyebrow || "Creator"} />
        </label>
        <label className="grid gap-2 text-sm">
          Content creator title
          <input className="admin-input" name="content_title" defaultValue={settings.content_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Content creator section
          <textarea className="admin-textarea" name="content_description" defaultValue={settings.content_description} />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube context label
          <input
            className="admin-input"
            name="content_youtube_context"
            defaultValue={settings.content_youtube_context || "Video channel"}
          />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube title
          <input className="admin-input" name="content_youtube_title" defaultValue={settings.content_youtube_title} />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube section
          <textarea className="admin-textarea" name="content_youtube_body" defaultValue={settings.content_youtube_body} />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube CTA label
          <input className="admin-input" name="content_youtube_cta" defaultValue={settings.content_youtube_cta || "Open channel"} />
        </label>
        <label className="grid gap-2 text-sm">
          Content themes (one per line)
          <textarea
            className="admin-textarea"
            name="content_themes"
            defaultValue={(settings.content_themes || []).join("\n")}
          />
        </label>
      </ActionForm>
    </div>
  );
}
