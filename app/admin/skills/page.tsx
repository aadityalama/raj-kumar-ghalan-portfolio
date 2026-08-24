import { ConfirmForm } from "@/app/admin/_components/form-status";
import { SkillActionForm } from "@/app/admin/skills/skill-action-form";
import { deleteSkillAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminSkillsPage() {
  await requireAdmin();
  const { skills } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Skills</h1>
      <article className="admin-card mt-8 p-5">
        <SkillActionForm skillId={null} className="grid gap-3 sm:grid-cols-2">
          <input className="admin-input" name="name" placeholder="Skill" required />
          <input className="admin-input" name="category" placeholder="Category" required />
          <input className="admin-input" name="level" placeholder="Level (optional)" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked /> Visible
          </label>
        </SkillActionForm>
      </article>
      <div className="mt-8 overflow-x-auto admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Category</th>
              <th>Level</th>
              <th>Order</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td colSpan={5}>
                  <SkillActionForm skillId={skill.id} className="grid gap-3 sm:grid-cols-4">
                    <input type="hidden" name="id" value={skill.id} />
                    <input className="admin-input" name="name" defaultValue={skill.name} />
                    <input className="admin-input" name="category" defaultValue={skill.category} />
                    <input className="admin-input" name="level" defaultValue={skill.level} />
                    <input className="admin-input" type="number" name="sort_order" defaultValue={skill.sort_order} />
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="visible" defaultChecked={skill.visible} /> Visible
                    </label>
                  </SkillActionForm>
                  <ConfirmForm action={deleteSkillAction} label="Delete skill">
                    <input type="hidden" name="id" value={skill.id} />
                  </ConfirmForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
