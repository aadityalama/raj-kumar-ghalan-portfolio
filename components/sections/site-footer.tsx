import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import type { SocialRow } from "@/lib/cms/types";

export function SiteFooter({
  positioning,
  items,
  socials,
  wordmark = site.wordmark,
  copyrightText,
}: {
  positioning: string;
  items: readonly { label: string; href: string }[];
  socials: SocialRow[];
  wordmark?: string;
  copyrightText?: string;
}) {
  const year = new Date().getFullYear();
  const name = copyrightText?.trim() || wordmark;

  return (
    <footer className="border-t border-border py-12 pb-[calc(3rem+var(--safe-bottom))]">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em]">{wordmark}</p>
            <p className="mt-3 text-sm text-muted">{positioning || site.positioning}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {items.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-text">
                {item.label}
              </a>
            ))}
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {socials.filter((item) => item.href).map((item) => (
              <li key={`${item.platform}-${item.href}`}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-text">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-xs text-subtle">
          © {year} {name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
