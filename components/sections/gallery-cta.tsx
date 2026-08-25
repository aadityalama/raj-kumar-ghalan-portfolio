import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { SettingsRow } from "@/lib/cms/types";

export function GalleryCta({
  settings,
  title,
  description,
}: {
  settings: SettingsRow;
  title?: string;
  description?: string;
}) {
  const heading = title || settings.gallery_page_eyebrow || "Photo Gallery";
  const body =
    description ||
    settings.gallery_page_description ||
    "A collection of moments from work, projects, and experiences.";
  const ctaLabel = settings.gallery_cta_label || "View Photo Gallery";
  const ctaHref = settings.gallery_cta_href || "/gallery";

  return (
    <section id="photo-gallery" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <header className="max-w-3xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              {heading}
            </p>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {body}
            </p>
          </header>
          <div className="mt-8">
            <ButtonLink href={ctaHref} variant="ghost">
              {ctaLabel}
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
