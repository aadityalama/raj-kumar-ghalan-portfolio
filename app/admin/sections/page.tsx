import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSectionAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminSectionsPage() {
  await requireAdmin();
  const { sections } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Sections</h1>
      <p className="mt-3 text-sm text-muted">Show, hide, rename, and reorder public sections.</p>
      <div className="mt-8 grid gap-4">
        {sections.map((section) => (
          <article key={section.id} className="admin-card p-5">
            <p className="text-xs text-subtle">{section.section_key}</p>
            <ActionForm action={saveSectionAction} className="mt-3 grid gap-3 sm:grid-cols-3">
              <input type="hidden" name="id" value={section.id} />
              <input className="admin-input" name="label" defaultValue={section.label} />
              <input className="admin-input" name="href" defaultValue={section.href} />
              <input className="admin-input" type="number" name="sort_order" defaultValue={section.sort_order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={section.visible} /> Visible
              </label>
            </ActionForm>
          </article>
        ))}
      </div>
    </div>
  );
}
