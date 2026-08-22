import { ActionForm } from "@/app/admin/_components/form-status";
import { saveSeoAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminSeoPage() {
  await requireAdmin();
  const { seo } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">SEO</h1>
      <ActionForm action={saveSeoAction} className="mt-8 grid gap-4">
        <label className="grid gap-2 text-sm">
          Site title
          <input className="admin-input" name="site_title" defaultValue={seo.site_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Meta description
          <textarea className="admin-textarea" name="meta_description" defaultValue={seo.meta_description} />
        </label>
        <label className="grid gap-2 text-sm">
          Keywords
          <input className="admin-input" name="keywords" defaultValue={seo.keywords.join(", ")} />
        </label>
        <label className="grid gap-2 text-sm">
          Open Graph title
          <input className="admin-input" name="og_title" defaultValue={seo.og_title} />
        </label>
        <label className="grid gap-2 text-sm">
          Open Graph description
          <textarea className="admin-textarea" name="og_description" defaultValue={seo.og_description} />
        </label>
        <label className="grid gap-2 text-sm">
          Social sharing image URL
          <input className="admin-input" name="og_image" defaultValue={seo.og_image} />
        </label>
        <label className="grid gap-2 text-sm">
          Or upload a sharing image
          <input className="admin-input" type="file" name="og_file" accept="image/jpeg,image/png,image/webp,image/gif" />
        </label>
      </ActionForm>
    </div>
  );
}
