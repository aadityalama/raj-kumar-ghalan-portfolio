import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminAboutPage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">About</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit the about section copy, experience label, and personal philosophy.
      </p>

      <ActionForm action={saveSettingsAction} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm">
          About eyebrow
          <input className="admin-input" name="about_eyebrow" defaultValue={settings.about_eyebrow || "01 / About"} />
        </label>
        <label className="grid gap-2 text-sm">
          About title
          <textarea className="admin-textarea" name="about_title" defaultValue={settings.about_title} />
        </label>
        <label className="grid gap-2 text-sm">
          About section
          <textarea className="admin-textarea" name="about_body" defaultValue={settings.about_body} />
        </label>
        <label className="grid gap-2 text-sm">
          About secondary
          <textarea className="admin-textarea" name="about_body_secondary" defaultValue={settings.about_body_secondary} />
        </label>
        <label className="grid gap-2 text-sm">
          Known experience heading
          <input
            className="admin-input"
            name="about_known_experience_heading"
            defaultValue={settings.about_known_experience_heading || "Known experience"}
          />
        </label>
        <label className="grid gap-2 text-sm">
          Known experience label
          <input className="admin-input" name="about_experience_label" defaultValue={settings.about_experience_label} />
        </label>
        <label className="grid gap-2 text-sm">
          Personal philosophy
          <textarea className="admin-textarea" name="philosophy" defaultValue={settings.philosophy} />
        </label>
      </ActionForm>
    </div>
  );
}
