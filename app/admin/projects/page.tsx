import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { deleteProjectAction, saveProjectAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const { projects } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Projects</h1>
      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Add project</h2>
        <ActionForm action={saveProjectAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className="admin-input" name="title" placeholder="Title" required />
          <input className="admin-input" name="category" placeholder="Category" />
          <textarea className="admin-textarea sm:col-span-2" name="description" placeholder="Description" />
          <input className="admin-input sm:col-span-2" name="technologies" placeholder="Technologies, comma separated" />
          <input className="admin-input" name="live_url" placeholder="Live URL" />
          <input className="admin-input" name="github_url" placeholder="GitHub URL" />
          <input className="admin-input" name="youtube_url" placeholder="YouTube URL" />
          <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          <input className="admin-input sm:col-span-2" type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published on site
          </label>
        </ActionForm>
      </article>

      <div className="mt-8 grid gap-4">
        {projects.map((project) => (
          <article key={project.id} className="admin-card p-5">
            {project.image_url ? (
              <div className="relative mb-4 aspect-[16/8] overflow-hidden rounded-xl">
                <Image src={project.image_url} alt={project.title} fill className="object-cover object-top" sizes="800px" />
              </div>
            ) : null}
            <ActionForm action={saveProjectAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="image_url" value={project.image_url} />
              <input type="hidden" name="image_path" value={project.image_path || ""} />
              <input className="admin-input" name="title" defaultValue={project.title} />
              <input className="admin-input" name="category" defaultValue={project.category} />
              <textarea className="admin-textarea sm:col-span-2" name="description" defaultValue={project.description} />
              <input className="admin-input sm:col-span-2" name="technologies" defaultValue={project.technologies.join(", ")} />
              <input className="admin-input" name="live_url" defaultValue={project.live_url} />
              <input className="admin-input" name="github_url" defaultValue={project.github_url} />
              <input className="admin-input" name="youtube_url" defaultValue={project.youtube_url} />
              <input className="admin-input" type="number" name="sort_order" defaultValue={project.sort_order} />
              <input className="admin-input sm:col-span-2" type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={project.published} /> Published on site
              </label>
            </ActionForm>
            <ConfirmForm action={deleteProjectAction} label="Delete project">
              <input type="hidden" name="id" value={project.id} />
              <input type="hidden" name="image_path" value={project.image_path || ""} />
            </ConfirmForm>
          </article>
        ))}
      </div>
    </div>
  );
}
