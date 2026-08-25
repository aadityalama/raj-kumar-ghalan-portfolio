import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { deleteHeroImageAction, saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminHomepagePage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();
  const hasHeroPhoto = Boolean(settings.hero_image_url);

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Homepage</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit the hero profile, headline, body copy, and primary calls to action. Changes appear on the live site after save.
      </p>

      <div className="mt-8 grid gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Hero / profile</p>
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Hero CTAs</p>
        {[
          ["hero_primary_cta_text", "Primary CTA text", settings.hero_primary_cta_text || "View My Work"],
          ["hero_primary_cta_href", "Primary CTA link", settings.hero_primary_cta_href || "#projects"],
          ["hero_secondary_cta_text", "Secondary CTA text", settings.hero_secondary_cta_text || "Let's Connect"],
          ["hero_secondary_cta_href", "Secondary CTA link", settings.hero_secondary_cta_href || "#contact"],
        ].map(([name, label, value]) => (
          <label key={name} className="grid gap-2 text-sm">
            {label}
            <input className="admin-input" name={name} defaultValue={value} />
          </label>
        ))}
      </ActionForm>
    </div>
  );
}
