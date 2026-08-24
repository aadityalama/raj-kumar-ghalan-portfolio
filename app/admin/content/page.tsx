import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { deleteHeroImageAction, saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminContentPage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();
  const hasHeroPhoto = Boolean(settings.hero_image_url);

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Website content</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit homepage, about, journey, philosophy, and YouTube copy. Changes appear on the live site after save.
      </p>

      <div className="mt-8 grid gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Homepage / profile</p>
        {hasHeroPhoto ? (
          <div className="flex flex-wrap items-end gap-4">
            <div className="relative h-32 w-24 overflow-hidden rounded-xl">
              <Image src={settings.hero_image_url} alt="Current hero portrait" fill className="object-cover" sizes="96px" />
            </div>
            <ConfirmForm
              action={deleteHeroImageAction}
              label="Remove photo"
              pendingLabel="Removing…"
              message="Remove the profile photo?"
            />
          </div>
        ) : null}
      </div>

      <ActionForm action={saveSettingsAction} className="mt-5 grid gap-5">
        <label className="grid gap-2 text-sm">
          Hero / profile photo
          <input className="admin-input" type="file" name="hero_image" accept="image/jpeg,image/png,image/webp,image/gif" />
        </label>
        {[
          ["hero_positioning", "Hero positioning", settings.hero_positioning],
          ["hero_title", "Hero title", settings.hero_title],
          ["hero_subtitle", "Hero subtitle", settings.hero_subtitle],
        ].map(([name, label, value]) => (
          <label key={name} className="grid gap-2 text-sm">
            {label}
            <input className="admin-input" name={name} defaultValue={value} />
          </label>
        ))}
        <label className="grid gap-2 text-sm">
          Hero body
          <textarea className="admin-textarea" name="hero_body" defaultValue={settings.hero_body} />
        </label>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">About</p>
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
          Known experience label
          <input className="admin-input" name="about_experience_label" defaultValue={settings.about_experience_label} />
        </label>
        <label className="grid gap-2 text-sm">
          Professional journey title
          <input className="admin-input" name="journey_title" defaultValue={settings.journey_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Professional journey
          <textarea className="admin-textarea" name="journey_description" defaultValue={settings.journey_description} />
        </label>
        <label className="grid gap-2 text-sm">
          Personal philosophy
          <textarea className="admin-textarea" name="philosophy" defaultValue={settings.philosophy} />
        </label>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">YouTube / content</p>
        <label className="grid gap-2 text-sm">
          Content creator title
          <input className="admin-input" name="content_title" defaultValue={settings.content_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Content creator section
          <textarea className="admin-textarea" name="content_description" defaultValue={settings.content_description} />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube title
          <input className="admin-input" name="content_youtube_title" defaultValue={settings.content_youtube_title} />
        </label>
        <label className="grid gap-2 text-sm">
          YouTube section
          <textarea className="admin-textarea" name="content_youtube_body" defaultValue={settings.content_youtube_body} />
        </label>
      </ActionForm>
    </div>
  );
}
