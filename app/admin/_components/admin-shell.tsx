"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/cms/actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Homepage / About" },
  { href: "/admin/market", label: "NEPSE Profile" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/product", label: "Product" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/social", label: "Social" },
  { href: "/admin/sections", label: "Sections" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/contact", label: "Contact" },
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

  const nav = (
    <>
      <p className="font-mono text-[11px] tracking-[0.22em]">ADMIN</p>
      <p className="mt-2 text-sm text-muted">{email}</p>
      <nav className="mt-6 grid gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="admin-link"
            data-active={pathname === link.href}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8 grid gap-2">
        <Link href="/" className="admin-link">
          View site
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
        <aside className="admin-sidebar hidden px-4 py-5 lg:sticky lg:top-0 lg:block lg:h-dvh">
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
