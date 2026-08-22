import { navigation, resolvedSocials, site } from "@/config/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 pb-[calc(3rem+var(--safe-bottom))]">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em]">{site.wordmark}</p>
            <p className="mt-3 text-sm text-muted">{site.positioning}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-text">
                {item.label}
              </a>
            ))}
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            {resolvedSocials().map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-text">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-xs text-subtle">
          © {year} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
