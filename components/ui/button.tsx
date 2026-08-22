"use client";

import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "link";

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-[#04110c] dark:text-[#04110c] hover:bg-accent-strong shadow-[0_0_0_1px_rgba(16,185,129,0.2),0_10px_30px_rgba(16,185,129,0.18)]",
  ghost:
    "border border-border-strong bg-transparent text-text hover:border-accent/50 hover:bg-accent-soft",
  link: "bg-transparent px-0 text-text hover:text-accent",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  const disabled = !href;
  const Comp = disabled ? "span" : "a";

  return (
    <Comp
      href={disabled ? undefined : href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium tracking-[-0.01em] transition-all duration-300",
        styles[variant],
        disabled && "pointer-events-none opacity-45",
        className,
      )}
    >
      {children}
    </Comp>
  );
}
