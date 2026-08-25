import Link from "next/link";
import { getAdminDashboard } from "@/lib/cms/admin-data";
import { requireAdmin } from "@/lib/cms/admin-auth";
import { adminEmail } from "@/lib/supabase/env";

const actions = [
  { href: "/admin/content", label: "Edit homepage & about" },
  { href: "/admin/gallery", label: "Upload photos" },
  { href: "/admin/projects", label: "Add a project" },
  { href: "/admin/product", label: "Edit product section" },
  { href: "/admin/market", label: "Update NEPSE profile" },
];

export default async function AdminHomePage() {
  await requireAdmin();
  const stats = await getAdminDashboard();
  const email = adminEmail();

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Overview</p>
      <h1 className="mt-3 text-4xl tracking-[-0.04em]">Dashboard</h1>

      {!stats.configured || !stats.cmsReady || !stats.adminGranted ? (
        <article className="admin-notice mt-6 text-sm text-muted">
          <p className="text-text">Setup still needed</p>
          <ul className="mt-3 grid gap-2">
            <li>
              {stats.configured
                ? "Supabase env is set."
                : "Add NEXT_PUBLIC_SUPABASE_URL and the public anon or publishable key."}
            </li>
            <li>{stats.cmsReady ? "CMS tables are reachable." : "Run supabase/migrations/001_portfolio_cms.sql in this portfolio’s Supabase project."}</li>
            <li>
              {stats.adminGranted
                ? `Write access is granted for ${email || "the configured admin"}.`
                : "Run supabase/migrations/002_grant_admin.sql after creating the Auth user that matches server-only ADMIN_EMAIL. Writes stay blocked by RLS until then."}
            </li>
            <li>
              Then run supabase/migrations/003_hero_image_and_storage_paths.sql,
              supabase/migrations/004_admin_userid_only.sql,
              supabase/migrations/005_table_privileges.sql, and
              supabase/migrations/006_product_section.sql.
            </li>
          </ul>
        </article>
      ) : null}

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total projects", stats.projects],
          ["Total gallery photos", stats.photos],
          ["Total skills", stats.skills],
          ["Total content sections", stats.sections],
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
              <li className="text-sm text-muted">No CMS updates yet. Apply the SQL migrations, then edit content.</li>
            )}
          </ul>
        </article>
      </div>
    </div>
  );
}
