import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import { deleteGalleryAction, saveGalleryAction } from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";
import { GALLERY_CATEGORIES } from "@/lib/cms/types";

export default async function AdminGalleryPage() {
  await requireAdmin();
  const { gallery } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Gallery</h1>
      <p className="mt-3 text-sm text-muted">
        JPEG, PNG, WebP, or GIF. 5MB max. Multiple files can be uploaded together.
      </p>

      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Upload photos</h2>
        <ActionForm action={saveGalleryAction} className="mt-4 grid gap-4">
          <input type="hidden" name="visible" value="on" />
          <label className="grid gap-2 text-sm">
            Files
            <input className="admin-input" type="file" name="files" accept="image/jpeg,image/png,image/webp,image/gif" multiple />
          </label>
          <label className="grid gap-2 text-sm">
            Category
            <select className="admin-select" name="category" defaultValue="Personal">
              {GALLERY_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm">
            Description
            <input className="admin-input" name="description" />
          </label>
        </ActionForm>
      </article>

      <div className="mt-8 grid gap-4">
        {gallery.map((photo) => (
          <article key={photo.id} className="admin-card grid gap-4 p-5 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-soft">
              <Image src={photo.image_url} alt={photo.title} fill className="object-cover" sizes="160px" />
            </div>
            <div>
              <ActionForm action={saveGalleryAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="image_url" value={photo.image_url} />
                <input type="hidden" name="image_path" value={photo.image_path || ""} />
                <label className="grid gap-2 text-sm">
                  Title
                  <input className="admin-input" name="title" defaultValue={photo.title} />
                </label>
                <label className="grid gap-2 text-sm">
                  Category
                  <select className="admin-select" name="category" defaultValue={photo.category}>
                    {GALLERY_CATEGORIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Description
                  <input className="admin-input" name="description" defaultValue={photo.description} />
                </label>
                <label className="grid gap-2 text-sm">
                  Order
                  <input className="admin-input" type="number" name="sort_order" defaultValue={photo.sort_order} />
                </label>
                <label className="grid gap-2 text-sm">
                  Replace photo
                  <input className="admin-input" type="file" name="file" accept="image/jpeg,image/png,image/webp,image/gif" />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="featured" defaultChecked={photo.featured} />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="visible" defaultChecked={photo.visible} />
                  Visible
                </label>
              </ActionForm>
              <ConfirmForm action={deleteGalleryAction} label="Delete photo">
                <input type="hidden" name="id" value={photo.id} />
                <input type="hidden" name="image_path" value={photo.image_path || ""} />
              </ConfirmForm>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
