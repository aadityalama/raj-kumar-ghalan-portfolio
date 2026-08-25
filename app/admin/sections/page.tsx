import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSectionAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminSectionsPage() {
  await requireAdmin();
  const { sections } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Navigation</h1>
      <p className="mt-3 text-sm text-muted">
        Enable or disable sections, change their order, and edit nav labels, eyebrows, titles, and descriptions.
      </p>
      <div className="mt-8 grid gap-4">
        {sections
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((section) => (
            <article key={section.id} className="admin-card p-5">
              <p className="text-xs text-subtle">{section.section_key}</p>
              <ActionForm action={saveSectionAction} className="mt-3 grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={section.id} />
                <label className="grid gap-2 text-sm">
                  Nav label
                  <input className="admin-input" name="label" defaultValue={section.label} />
                </label>
                <label className="grid gap-2 text-sm">
                  Href
                  <input className="admin-input" name="href" defaultValue={section.href} />
                </label>
                <label className="grid gap-2 text-sm">
                  Section title
                  <input className="admin-input" name="title" defaultValue={section.title || ""} />
                </label>
                <label className="grid gap-2 text-sm">
                  Eyebrow
                  <input className="admin-input" name="eyebrow" defaultValue={section.eyebrow || ""} />
                </label>
                <label className="grid gap-2 text-sm">
                  Order
                  <input
                    className="admin-input"
                    type="number"
                    name="sort_order"
                    defaultValue={section.sort_order}
                  />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Description
                  <input
                    className="admin-input"
                    name="description"
                    defaultValue={section.description || ""}
                  />
                </label>
                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                  <input type="checkbox" name="visible" defaultChecked={section.visible} /> Visible
                </label>
              </ActionForm>
            </article>
          ))}
      </div>
    </div>
  );
}
