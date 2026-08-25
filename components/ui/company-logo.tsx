"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md";

const sizeClass: Record<Size, string> = {
  sm: "size-8",
  md: "size-10",
};

/**
 * Small company mark shown immediately before the company name.
 * Renders nothing when no URL is configured. On load failure, shows a
 * subtle letter fallback instead of a broken image.
 */
export function CompanyLogo({
  src,
  company,
  size = "sm",
  className,
}: {
  src?: string | null;
  company: string;
  size?: Size;
  className?: string;
}) {
  const url = (src || "").trim();
  const [failed, setFailed] = useState(false);

  if (!url) return null;

  const initial = (company.trim().charAt(0) || "?").toUpperCase();

  if (failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-bg-soft font-mono text-[11px] uppercase text-subtle",
          sizeClass[size],
          className,
        )}
      >
        {initial}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS URLs; next/image remotePatterns are Supabase-only
    <img
      src={url}
      alt=""
      width={size === "md" ? 40 : 32}
      height={size === "md" ? 40 : 32}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 rounded-lg border border-border bg-white object-contain p-1",
        sizeClass[size],
        className,
      )}
    />
  );
}
