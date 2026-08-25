import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSettingsAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminMarketPage() {
  await requireAdmin();
  const { settings } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Spotlight</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Optional focus section for a specialty, audience, or professional spotlight. Keep claims accurate.
      </p>
      <ActionForm action={saveSettingsAction} className="mt-8 grid gap-5">
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
          Followers
          <input className="admin-input" name="market_followers" defaultValue={settings.market_followers} />
        </label>
        <label className="grid gap-2 text-sm">
          Posts
          <input className="admin-input" name="market_posts" defaultValue={settings.market_posts} />
        </label>
        <label className="grid gap-2 text-sm">
          Facebook page URL
          <input className="admin-input" name="market_facebook_url" defaultValue={settings.market_facebook_url} />
        </label>
      </ActionForm>
    </div>
  );
}
