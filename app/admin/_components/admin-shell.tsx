"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_PRODUCT_NAME } from "@/config/admin";
import { logoutAction } from "@/lib/cms/actions";

const primaryLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Homepage" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/content-youtube", label: "Content / YouTube" },
  { href: "/admin/market", label: "Market / NEPSE" },
  { href: "/admin/social", label: "Social Links" },
  { href: "/admin/sections", label: "Navigation" },
  { href: "/admin/footer", label: "Footer" },
  { href: "/admin/settings", label: "Site Settings" },
];

const secondaryLinks = [
  { href: "/admin/product", label: "Featured case study" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/onboarding", label: "Setup wizard" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname.startsWith(href));

  const nav = (
    <>
      <p className="font-mono text-[11px] tracking-[0.22em]">{ADMIN_PRODUCT_NAME.toUpperCase()}</p>
      <p className="mt-2 text-sm text-muted">{email}</p>
      <nav className="mt-6 grid gap-1">
        {primaryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="admin-link"
            data-active={isActive(link.href)}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">More</p>
      <nav className="mt-2 grid gap-1">
        {secondaryLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="admin-link"
            data-active={isActive(link.href)}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 grid gap-2">
        <Link href="/" target="_blank" className="admin-link">
          Preview site
        </Link>
        <Link href="/admin/preview" className="admin-link">
          Preview checklist
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="admin-link w-full">
            Log out
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="admin-shell dark min-h-dvh bg-bg text-text">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="admin-sidebar hidden px-4 py-5 lg:sticky lg:top-0 lg:block lg:h-dvh lg:overflow-y-auto">
          {nav}
        </aside>
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <aside className="admin-sidebar relative h-full w-[min(20rem,86vw)] overflow-y-auto px-4 py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-[0.2em]">MENU</p>
                <button
                  type="button"
                  className="min-h-11 rounded-full border border-border px-4"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              {nav}
            </aside>
          </div>
        ) : null}
        <div>
          <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur lg:hidden">
            <p className="font-mono text-[11px] tracking-[0.2em]">ADMIN</p>
            <button
              type="button"
              className="min-h-11 rounded-full border border-border px-4"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
          </div>
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
