import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { CompanyLogoFields } from "@/app/admin/experience/company-logo-fields";
import { deleteExperienceAction, saveExperienceAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminExperiencePage() {
  await requireAdmin();
  const { experience } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Experience</h1>
      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Add role</h2>
        <ActionForm action={saveExperienceAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="admin-input" name="company" placeholder="Company" required />
          <input className="admin-input" name="position" placeholder="Position" required />
          <CompanyLogoFields />
          <input className="admin-input" name="start_year" placeholder="Start year" />
          <input className="admin-input" name="end_year" placeholder="End year or Present" />
          <textarea className="admin-textarea sm:col-span-2" name="description" placeholder="Description" />
          <input className="admin-input sm:col-span-2" name="technologies" placeholder="Technologies, comma separated" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" /> Featured
          </label>
        </ActionForm>
      </article>
      <div className="mt-8 grid gap-4">
        {experience.map((item) => (
          <article key={item.id} className="admin-card p-5">
            <ActionForm action={saveExperienceAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <input className="admin-input" name="company" defaultValue={item.company} />
              <input className="admin-input" name="position" defaultValue={item.position} />
              <CompanyLogoFields defaultUrl={item.company_logo_url || ""} />
              <input className="admin-input" name="start_year" defaultValue={item.start_year} />
              <input className="admin-input" name="end_year" defaultValue={item.end_year} />
              <textarea className="admin-textarea sm:col-span-2" name="description" defaultValue={item.description} />
              <input className="admin-input sm:col-span-2" name="technologies" defaultValue={item.technologies.join(", ")} />
              <input className="admin-input" type="number" name="sort_order" defaultValue={item.sort_order} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={item.featured} /> Featured
              </label>
            </ActionForm>
            <ConfirmForm action={deleteExperienceAction} label="Delete role">
              <input type="hidden" name="id" value={item.id} />
            </ConfirmForm>
          </article>
        ))}
      </div>
    </div>
  );
}
