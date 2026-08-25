import Link from "next/link";
import { getAdminDashboard } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { getAdminCollections } from "@/lib/cms/admin-data";
import { adminEmail } from "@/lib/supabase/env";

const actions = [
  { href: "/admin/content", label: "Edit homepage & about" },
  { href: "/admin/gallery", label: "Upload photos" },
  { href: "/admin/projects", label: "Add a project" },
  { href: "/admin/product", label: "Edit featured work" },
  { href: "/admin/settings", label: "Brand settings" },
  { href: "/admin/onboarding", label: "Run setup wizard" },
];

export default async function AdminHomePage() {
  await requireAdmin();
  const stats = await getAdminDashboard();
  const collections = await getAdminCollections();
  const { settings, resolutionError, siteId, siteSlug, isOwnerSite } = collections;
  const email = adminEmail();
  const needsOnboarding = settings.onboarding_completed === false && !isOwnerSite;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Overview</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em]">Dashboard</h1>

      {resolutionError || stats.resolutionError ? (
        <article className="admin-notice mt-6 border border-red-500/40 text-sm text-muted">
          <p className="text-text">Site resolution / CMS error</p>
          <p className="mt-2 font-mono text-xs text-red-200">
            {resolutionError || stats.resolutionError}
          </p>
          <p className="mt-3 text-xs">
            Demo company placeholders are not shown when the owner site cannot be
            loaded. Fix migrations / OWNER_ADMIN_EMAIL / domain mapping, then refresh.
          </p>
        </article>
      ) : null}

      {siteId ? (
        <p className="mt-4 font-mono text-[11px] text-subtle">
          Editing site: {siteSlug || "unknown"} · {siteId}
          {isOwnerSite ? " · owner site" : " · customer site"}
        </p>
      ) : null}

      {needsOnboarding ? (
        <article className="admin-notice mt-6 text-sm text-muted">
          <p className="text-text">Finish first-time setup</p>
          <p className="mt-2">
            Complete the guided wizard to set your name, photo, title, and first project.
          </p>
          <Link href="/admin/onboarding" className="admin-link mt-4 inline-flex">
            Open setup wizard →
          </Link>
        </article>
      ) : null}

      {!stats.configured || !stats.cmsReady || !stats.adminGranted ? (
        <article className="admin-notice mt-6 text-sm text-muted">
          <p className="text-text">Setup still needed</p>
          <ul className="mt-3 grid gap-2">
            <li>
              {stats.configured
                ? "Supabase env is set."
                : "Add NEXT_PUBLIC_SUPABASE_URL and the public anon or publishable key."}
            </li>
            <li>
              {stats.cmsReady
                ? "CMS tables are reachable."
                : "Run supabase/migrations in order (001 through 009) in this portfolio’s Supabase project. Do not run demo_content.sql on the owner database."}
            </li>
            <li>
              {stats.adminGranted
                ? `Write access is granted for ${email || "the configured admin"}.`
                : "Grant admin access after creating the Auth user that matches server-only ADMIN_EMAIL / OWNER_ADMIN_EMAIL. Writes stay blocked by RLS until then."}
            </li>
          </ul>
        </article>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total projects", stats.projects],
          ["Total gallery photos", stats.photos],
          ["Total skills", stats.skills],
          ["Product cards", stats.productCards],
        ].map(([label, value]) => (
          <article key={String(label)} className="admin-card p-5">
            <p className="text-xs text-subtle">{label}</p>
            <p className="mt-3 text-3xl tracking-[-0.04em]">{value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <article className="admin-card p-5">
          <h2 className="text-lg tracking-[-0.03em]">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {actions.map((item) => (
              <Link key={item.href} href={item.href} className="admin-link">
                {item.label} →
              </Link>
            ))}
          </div>
        </article>
        <article className="admin-card p-5">
          <h2 className="text-lg tracking-[-0.03em]">Recent updates</h2>
          <ul className="mt-4 grid gap-3">
            {stats.recent.length ? (
              stats.recent.map((item) => (
                <li key={`${item.label}-${item.at}`} className="flex justify-between gap-4 text-sm">
                  <span>{item.label}</span>
                  <span className="text-subtle">{new Date(item.at).toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">
                No CMS updates yet for this site. If this is the owner site and you expected existing
                content, check site_id mapping — demo seed content is not injected here.
              </li>
            )}
          </ul>
        </article>
      </div>
    </div>
  );
}
