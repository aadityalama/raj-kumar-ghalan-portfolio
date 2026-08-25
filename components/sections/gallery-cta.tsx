import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function GalleryCta() {
  return (
    <section id="photo-gallery" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <header className="max-w-3xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Photo Gallery
            </p>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
              A collection of moments from my work, projects, journey, and experiences.
            </p>
          </header>
          <div className="mt-8">
            <ButtonLink href="/gallery" variant="ghost">
              View Photo Gallery
              <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
