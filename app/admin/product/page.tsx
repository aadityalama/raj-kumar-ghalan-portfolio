import Image from "next/image";
import { ActionForm, ConfirmForm } from "@/app/admin/_components/form-status";
import {
  deleteProductCardAction,
  deleteProductFeatureAction,
  removeProductCardImageAction,
  saveProductCardAction,
  saveProductFeatureAction,
  saveProductSettingsAction,
} from "@/lib/cms/actions";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminProductPage() {
  await requireAdmin();
  const { productSettings, productCards, productFeatures, configured } = await getAdminCollections();

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Product</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Edit the FIRE Nepal “The Product” section on the homepage — section title, product image cards,
        and numbered feature cards.
      </p>
      {!configured ? (
        <p className="admin-notice mt-6 text-sm text-muted">
          Supabase is not configured. Showing fallback content. Apply migration{" "}
          <code>006_product_section.sql</code> after env is set.
        </p>
      ) : null}

      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Section title</h2>
        <ActionForm action={saveProductSettingsAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm sm:col-span-2">
            Eyebrow / title
            <input
              className="admin-input"
              name="section_title"
              defaultValue={productSettings.section_title}
              placeholder="The Product"
              required
            />
          </label>
        </ActionForm>
      </article>

      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Add product card</h2>
        <p className="mt-2 text-sm text-muted">JPEG, PNG, WebP, or GIF. 5MB max.</p>
        <ActionForm action={saveProductCardAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="visible" value="on" />
          <label className="grid gap-2 text-sm">
            Title
            <input className="admin-input" name="title" placeholder="Home" required />
          </label>
          <label className="grid gap-2 text-sm">
            Order
            <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Description
            <input className="admin-input" name="description" placeholder="Alt / description text" />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Link / URL
            <input className="admin-input" name="link_url" placeholder="https://…" />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Image
            <input
              className="admin-input"
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </label>
        </ActionForm>
      </article>

      <div className="mt-8 grid gap-4">
        <h2 className="text-lg">Product cards</h2>
        {productCards.map((card) => (
          <article key={card.id} className="admin-card grid gap-4 p-5 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-bg-soft">
              {card.image_url ? (
                <Image src={card.image_url} alt={card.title} fill className="object-cover object-top" sizes="160px" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted">No image</div>
              )}
            </div>
            <div>
              <ActionForm action={saveProductCardAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={card.id} />
                <input type="hidden" name="image_url" value={card.image_url} />
                <input type="hidden" name="image_path" value={card.image_path || ""} />
                <label className="grid gap-2 text-sm">
                  Title
                  <input className="admin-input" name="title" defaultValue={card.title} required />
                </label>
                <label className="grid gap-2 text-sm">
                  Order
                  <input className="admin-input" type="number" name="sort_order" defaultValue={card.sort_order} />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Description
                  <input className="admin-input" name="description" defaultValue={card.description} />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Link / URL
                  <input className="admin-input" name="link_url" defaultValue={card.link_url} />
                </label>
                <label className="grid gap-2 text-sm sm:col-span-2">
                  Replace image
                  <input
                    className="admin-input"
                    type="file"
                    name="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="visible" defaultChecked={card.visible} />
                  Visible
                </label>
              </ActionForm>
              <div className="mt-3 flex flex-wrap gap-4">
                {card.image_url ? (
                  <ConfirmForm
                    action={removeProductCardImageAction}
                    label="Remove image"
                    message="Remove this product card image? The card will remain."
                    pendingLabel="Removing…"
                  >
                    <input type="hidden" name="id" value={card.id} />
                    <input type="hidden" name="image_path" value={card.image_path || ""} />
                  </ConfirmForm>
                ) : null}
                <ConfirmForm action={deleteProductCardAction} label="Delete card">
                  <input type="hidden" name="id" value={card.id} />
                  <input type="hidden" name="image_path" value={card.image_path || ""} />
                </ConfirmForm>
              </div>
            </div>
          </article>
        ))}
      </div>

      <article className="admin-card mt-10 p-5">
        <h2 className="text-lg">Add feature card</h2>
        <ActionForm action={saveProductFeatureAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input type="hidden" name="visible" value="on" />
          <label className="grid gap-2 text-sm">
            Title
            <input className="admin-input" name="title" placeholder="Dashboard" required />
          </label>
          <label className="grid gap-2 text-sm">
            Order
            <input className="admin-input" type="number" name="sort_order" defaultValue={0} />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Description (optional)
            <input className="admin-input" name="description" placeholder="Shown only when set" />
          </label>
        </ActionForm>
      </article>

      <div className="mt-8 grid gap-4">
        <h2 className="text-lg">Feature cards</h2>
        {productFeatures.map((feature, index) => (
          <article key={feature.id} className="admin-card p-5">
            <p className="mb-3 font-mono text-[11px] text-accent">
              Display number {String(index + 1).padStart(2, "0")} (from order)
            </p>
            <ActionForm action={saveProductFeatureAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={feature.id} />
              <label className="grid gap-2 text-sm">
                Title
                <input className="admin-input" name="title" defaultValue={feature.title} required />
              </label>
              <label className="grid gap-2 text-sm">
                Order
                <input className="admin-input" type="number" name="sort_order" defaultValue={feature.sort_order} />
              </label>
              <label className="grid gap-2 text-sm sm:col-span-2">
                Description (optional)
                <input className="admin-input" name="description" defaultValue={feature.description} />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={feature.visible} />
                Visible
              </label>
            </ActionForm>
            <ConfirmForm action={deleteProductFeatureAction} label="Delete feature">
              <input type="hidden" name="id" value={feature.id} />
            </ConfirmForm>
          </article>
        ))}
      </div>
    </div>
  );
}
