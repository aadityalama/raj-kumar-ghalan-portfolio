"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { navigation, site } from "@/config/site";
import { ThemeToggle } from "@/components/navigation/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader({
  items = navigation,
}: {
  items?: readonly { label: string; href: string }[];
}) {
  const sectionIds = useMemo(
    () => items.map((item) => item.href.replace("#", "")),
    [items],
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("about");
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 border-b transition-[background,border,backdrop-filter] duration-300",
          open ? "z-[100]" : "z-50",
          scrolled || open
            ? "border-border bg-bg/72 backdrop-blur-xl"
            : "border-transparent bg-transparent",
          open && "border-border bg-bg backdrop-blur-none",
        )}
      >
        <div className="mx-auto flex h-[var(--nav-height)] max-w-[1180px] items-center justify-between px-5 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="font-mono text-[11px] tracking-[0.22em] text-text"
          >
            {site.wordmark}
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {items.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative py-1 text-[13px] text-muted transition-colors hover:text-text",
                    isActive && "text-text",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-1 h-px origin-left bg-accent transition-transform duration-300",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden min-h-11 items-center rounded-full border border-border px-4 text-[13px] text-text transition-colors hover:border-accent/40 lg:inline-flex"
            >
              Let’s Talk
              <span className="ml-1.5" aria-hidden="true">
                →
              </span>
            </a>
            <button
              type="button"
              className="relative z-[1] grid size-11 place-items-center rounded-full border border-border lg:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="relative block h-3 w-4" aria-hidden="true">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-text transition-transform duration-300",
                    open && "top-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-text transition-transform duration-300",
                    open && "bottom-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="mobile-nav-overlay fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-bg lg:hidden"
        >
          <nav
            className="mx-auto flex min-h-full max-w-[1180px] flex-col px-5 pb-[calc(var(--safe-bottom)+1.5rem)] pt-[calc(var(--nav-height)+1.5rem)] sm:px-6"
            aria-label="Mobile"
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="mobile-nav-link shrink-0 border-b border-border py-5 text-3xl tracking-[-0.04em] text-text transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mobile-nav-link mt-6 inline-flex min-h-12 shrink-0 items-center text-lg text-accent transition-opacity hover:opacity-80"
            >
              Let’s Talk →
            </a>
          </nav>
        </div>
      ) : null}
    </>
  );
}
