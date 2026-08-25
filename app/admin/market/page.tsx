import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminMarketPage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Market / NEPSE</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit spotlight copy and configuration around your market focus. Live follower/post counts remain the values you publish here — they are not fetched automatically.
      </p>
      <ActionForm action={saveSettingsAction} className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm">
          Eyebrow
          <input className="admin-input" name="market_eyebrow" defaultValue={settings.market_eyebrow || "Spotlight"} />
        </label>
        <label className="grid gap-2 text-sm">
          Title
          <input className="admin-input" name="market_title" defaultValue={settings.market_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Description
          <textarea className="admin-textarea" name="market_description" defaultValue={settings.market_description} />
        </label>
        <label className="grid gap-2 text-sm">
          Profile
          <textarea className="admin-textarea" name="market_profile" defaultValue={settings.market_profile} />
        </label>
        <label className="grid gap-2 text-sm">
          Note
          <textarea className="admin-textarea" name="market_note" defaultValue={settings.market_note} />
        </label>
        <label className="grid gap-2 text-sm">
          Followers value
          <input className="admin-input" name="market_followers" defaultValue={settings.market_followers} />
        </label>
        <label className="grid gap-2 text-sm">
          Followers label
          <input className="admin-input" name="market_followers_label" defaultValue={settings.market_followers_label || "Followers"} />
        </label>
        <label className="grid gap-2 text-sm">
          Posts value
          <input className="admin-input" name="market_posts" defaultValue={settings.market_posts} />
        </label>
        <label className="grid gap-2 text-sm">
          Posts label
          <input className="admin-input" name="market_posts_label" defaultValue={settings.market_posts_label || "Posts"} />
        </label>
        <label className="grid gap-2 text-sm">
          Facebook page URL
          <input className="admin-input" name="market_facebook_url" defaultValue={settings.market_facebook_url} />
        </label>
        <label className="grid gap-2 text-sm">
          Facebook CTA label
          <input className="admin-input" name="market_facebook_cta" defaultValue={settings.market_facebook_cta || "Open profile"} />
        </label>
        <label className="grid gap-2 text-sm">
          Capabilities (one per line)
          <textarea
            className="admin-textarea"
            name="market_capabilities"
            defaultValue={(settings.market_capabilities || []).join("\n")}
          />
        </label>
      </ActionForm>
    </div>
  );
}
