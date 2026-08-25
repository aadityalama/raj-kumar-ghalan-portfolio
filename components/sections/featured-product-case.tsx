import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CaseVisuals } from "@/components/sections/case-visuals";
import type { ProductCardRow, ProductFeatureRow, ProductSettingsRow } from "@/lib/cms/types";

export function FeaturedProductCase({
  settings,
  productCards = [],
  productFeatures = [],
}: {
  settings: ProductSettingsRow;
  productCards?: ProductCardRow[];
  productFeatures?: ProductFeatureRow[];
}) {
  if (settings.visible === false) return null;

  const chapters = [
    {
      title: settings.problem_title || "The Problem",
      body: settings.problem_body || "",
    },
    {
      title: settings.vision_title || "The Vision",
      body: settings.vision_body || "",
    },
    {
      title: settings.built_title || "What I Built",
      body: settings.built_body || "",
    },
  ].filter((item) => item.body);

  const technologies = settings.technologies || [];
  const liveUrl = settings.live_url || "";
  const caseTitle = settings.case_title || "Featured work, in focus";
  const eyebrow = settings.case_eyebrow || "Featured work";
  const sectionTitle = settings.section_title || "The Product";

  return (
    <section id="product" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
          <h2 className="max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            {caseTitle}
          </h2>
          {settings.short_description ? (
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted">
              {settings.short_description}
            </p>
          ) : null}
          {settings.category ? (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
              {settings.category}
            </p>
          ) : null}
          {liveUrl ? (
            <div className="mt-6">
              <ButtonLink href={liveUrl} external>
                Live Project
              </ButtonLink>
            </div>
          ) : null}
        </Reveal>

        {chapters.length ? (
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
        ) : null}

        <Reveal className="mt-14">
          <h3 className="text-sm uppercase tracking-[0.18em] text-subtle">{sectionTitle}</h3>
          <CaseVisuals cards={productCards} />
          {productFeatures.length ? (
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {productFeatures.map((area, index) => (
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

        {(technologies.length || settings.philosophy_body) && (
          <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-2">
            {technologies.length ? (
              <Reveal>
                <h3 className="text-xl tracking-[-0.03em]">{settings.tech_title || "Technology"}</h3>
                {settings.tech_body ? (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{settings.tech_body}</p>
                ) : null}
                <ul className="mt-5 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
            {settings.philosophy_body ? (
              <Reveal delay={0.08}>
                <h3 className="text-xl tracking-[-0.03em]">
                  {settings.philosophy_title || "Product philosophy"}
                </h3>
                <p className="display mt-4 max-w-md text-2xl leading-snug tracking-[-0.03em] text-muted sm:text-3xl">
                  {settings.philosophy_body}
                </p>
              </Reveal>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}

/** @deprecated Use FeaturedProductCase — kept for import compatibility during migration. */
export { FeaturedProductCase as FireNepalCase };
