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
      <h1 className="text-4xl tracking-[-0.04em]">Product / Featured Work</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Configure the reusable featured product / case study section — title, story chapters, image
        cards, feature list, technologies, and visibility. Works for any customer product.
      </p>
      {!configured ? (
        <p className="admin-notice mt-6 text-sm text-muted">
          Supabase is not configured. Showing fallback content. Apply migration{" "}
          <code>006_product_section.sql</code> and <code>007_productize_multitenant.sql</code> after
          env is set.
        </p>
      ) : null}

      <article className="admin-card mt-8 p-5">
        <h2 className="text-lg">Case study & product settings</h2>
        <ActionForm action={saveProductSettingsAction} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm sm:col-span-2">
            Product section title
            <input
              className="admin-input"
              name="section_title"
              defaultValue={productSettings.section_title}
              placeholder="The Product"
              required
            />
          </label>
          <label className="grid gap-2 text-sm">
            Case study title
            <input
              className="admin-input"
              name="case_title"
              defaultValue={productSettings.case_title || ""}
              placeholder="Featured project, in focus"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Eyebrow
            <input
              className="admin-input"
              name="case_eyebrow"
              defaultValue={productSettings.case_eyebrow || "Featured work"}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Category
            <input
              className="admin-input"
              name="category"
              defaultValue={productSettings.category || ""}
              placeholder="FinTech · SaaS"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Live URL
            <input
              className="admin-input"
              name="live_url"
              defaultValue={productSettings.live_url || ""}
              placeholder="https://"
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Short description
            <textarea
              className="admin-input min-h-20"
              name="short_description"
              defaultValue={productSettings.short_description || ""}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Problem title
            <input
              className="admin-input"
              name="problem_title"
              defaultValue={productSettings.problem_title || "The Problem"}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Vision title
            <input
              className="admin-input"
              name="vision_title"
              defaultValue={productSettings.vision_title || "The Vision"}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Problem body
            <textarea
              className="admin-input min-h-20"
              name="problem_body"
              defaultValue={productSettings.problem_body || ""}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Vision body
            <textarea
              className="admin-input min-h-20"
              name="vision_body"
              defaultValue={productSettings.vision_body || ""}
            />
          </label>
          <label className="grid gap-2 text-sm">
            Built title
            <input
              className="admin-input"
              name="built_title"
              defaultValue={productSettings.built_title || "What I Built"}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Built body
            <textarea
              className="admin-input min-h-20"
              name="built_body"
              defaultValue={productSettings.built_body || ""}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Technologies (comma-separated)
            <input
              className="admin-input"
              name="technologies"
              defaultValue={(productSettings.technologies || []).join(", ")}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Tech body
            <textarea
              className="admin-input min-h-16"
              name="tech_body"
              defaultValue={productSettings.tech_body || ""}
            />
          </label>
          <label className="grid gap-2 text-sm sm:col-span-2">
            Philosophy body
            <textarea
              className="admin-input min-h-16"
              name="philosophy_body"
              defaultValue={productSettings.philosophy_body || ""}
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="visible" defaultChecked={productSettings.visible !== false} />{" "}
            Visible on homepage
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
          <label className="grid gap-2 text-sm">
            Category
            <input className="admin-input" name="category" placeholder="Product" />
          </label>
          <label className="grid gap-2 text-sm">
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
