import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { deleteSocialAction, saveSocialAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminSocialPage() {
  await requireAdmin();
  const { socials } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Social links</h1>
      <article className="admin-card mt-8 p-5">
        <ActionForm action={saveSocialAction} className="grid gap-3 sm:grid-cols-2">
          <input className="admin-input" name="platform" placeholder="facebook, youtube, instagram..." required />
          <input className="admin-input" name="label" placeholder="Label" required />
          <input className="admin-input sm:col-span-2" name="href" placeholder="URL" />
          <input className="admin-input" name="note" placeholder="Note" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked /> Visible
          </label>
        </ActionForm>
      </article>
      <div className="mt-8 grid gap-4">
        {socials.map((item) => (
          <article key={item.id} className="admin-card p-5">
            <ActionForm action={saveSocialAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <input className="admin-input" name="platform" defaultValue={item.platform} />
              <input className="admin-input" name="label" defaultValue={item.label} />
              <input className="admin-input sm:col-span-2" name="href" defaultValue={item.href} />
              <input className="admin-input" name="note" defaultValue={item.note} />
              <input className="admin-input" type="number" name="sort_order" defaultValue={item.sort_order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible
              </label>
            </ActionForm>
            <ConfirmForm action={deleteSocialAction} label="Delete link">
              <input type="hidden" name="id" value={item.id} />
            </ConfirmForm>
          </article>
        ))}
      </div>
    </div>
  );
}
