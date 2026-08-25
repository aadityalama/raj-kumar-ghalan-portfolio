import Link from "next/link";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";

export default async function AdminPreviewPage() {
  await requireAdmin();
  const data = await getAdminCollections();

  const checks = [
    {
      label: "Name / brand",
      ok: Boolean(data.settings.brand_name || data.settings.hero_title),
      href: "/admin/settings",
    },
    {
      label: "Profile photo",
      ok: Boolean(data.settings.hero_image_url),
      href: "/admin/content",
    },
    {
      label: "About copy",
      ok: Boolean(data.settings.about_body),
      href: "/admin/content",
    },
    {
      label: "At least one project",
      ok: data.projects.length > 0,
      href: "/admin/projects",
    },
    {
      label: "Contact email",
      ok: Boolean(data.contact.email),
      href: "/admin/contact",
    },
    {
      label: "SEO title",
      ok: Boolean(data.seo.site_title),
      href: "/admin/seo",
    },
    {
      label: "Homepage sections configured",
      ok: data.sections.length > 0,
      href: "/admin/sections",
    },
  ];

  return (
    <div>
      <h1 className="text-4xl tracking-[-0.04em]">Preview</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Changes publish immediately when saved. Use this checklist before sharing your site, then open
        the live preview.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" target="_blank" className="admin-link">
          Open public site →
        </Link>
        <Link href="/gallery" target="_blank" className="admin-link">
          Open gallery →
        </Link>
      </div>

      <ul className="mt-8 grid gap-3">
        {checks.map((item) => (
          <li key={item.label} className="admin-card flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm">{item.label}</p>
              <p className="mt-1 text-xs text-subtle">{item.ok ? "Ready" : "Needs attention"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={item.ok ? "text-accent" : "text-red-400"}>{item.ok ? "✓" : "!"}</span>
              <Link href={item.href} className="text-sm text-muted hover:text-text">
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
