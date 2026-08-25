import { projects } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CaseVisuals } from "@/components/sections/case-visuals";
import type { ProductCardRow, ProductFeatureRow } from "@/lib/cms/types";

const chapters = [
  {
    title: "The Problem",
    body: "Many people struggle to understand their complete financial picture — savings progress, investments, retirement needs, and the long path to financial independence.",
  },
  {
    title: "The Vision",
    body: "Build one practical financial platform designed around the financial realities of Nepalis — at home and abroad.",
  },
  {
    title: "What I Built",
    body: "I approached FIRE Nepal as a product, not a demo: a connected set of tools for wealth, cashflow, savings, business, and guidance — designed to be used on a phone after work.",
  },
] as const;

export function FireNepalCase({
  liveUrl,
  sectionTitle = "The Product",
  productCards = [],
  productFeatures = [],
}: {
  liveUrl?: string;
  sectionTitle?: string;
  productCards?: ProductCardRow[];
  productFeatures?: ProductFeatureRow[];
}) {
  const project = { ...projects.fireNepal, href: liveUrl || projects.fireNepal.href };
  const cards =
    productCards.length > 0
      ? productCards
      : projects.fireNepal.visuals.map((visual, index) => ({
          id: `fire-nepal-visual-${index}`,
          title: visual.caption,
          description: visual.alt,
          image_url: visual.src,
          image_path: null,
          link_url: "",
          visible: true,
          sort_order: (index + 1) * 10,
        }));
  const features =
    productFeatures.length > 0
      ? productFeatures
      : projects.fireNepal.productAreas.map((title, index) => ({
          id: `fire-nepal-feature-${index}`,
          title,
          description: "",
          visible: true,
          sort_order: (index + 1) * 10,
        }));

  return (
    <section id="fire-nepal" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            04 / Case study
          </p>
          <h2 className="max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            FIRE Nepal, in focus
          </h2>
          {project.href ? (
            <div className="mt-6">
              <ButtonLink href={project.href} external>
                Live Project
              </ButtonLink>
            </div>
          ) : null}
        </Reveal>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <StaggerItem
              key={chapter.title}
              className="rounded-[1.3rem] border border-border bg-bg-elevated p-6"
            >
              <h3 className="text-xl tracking-[-0.03em]">{chapter.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{chapter.body}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14">
          <h3 className="text-sm uppercase tracking-[0.18em] text-subtle">{sectionTitle}</h3>
          <CaseVisuals cards={cards} />
          {features.length ? (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {features.map((area, index) => (
                <li
                  key={area.id || `${area.title}-${index}`}
                  className="rounded-[1.1rem] border border-border bg-bg-card px-4 py-5"
                >
                  <span className="font-mono text-[10px] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm tracking-[-0.02em]">{area.title}</p>
                  {area.description ? (
                    <p className="mt-2 text-xs leading-relaxed text-muted">{area.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
          <Reveal>
            <h3 className="text-xl tracking-[-0.03em]">Technology</h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              Built as a modern web product with a mobile-first architecture.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="text-xl tracking-[-0.03em]">Product philosophy</h3>
            <p className="display mt-4 max-w-md text-2xl leading-snug tracking-[-0.03em] text-muted sm:text-3xl">
              Technology should simplify financial decisions, not make them harder.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
