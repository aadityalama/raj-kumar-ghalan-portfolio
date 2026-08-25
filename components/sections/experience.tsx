import Image from "next/image";
import { experience } from "@/config/site";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CompanyLogo } from "@/components/ui/company-logo";
import { ExperiencePhotos } from "@/components/sections/experience-photos";
import type { ExperienceRow, SettingsRow } from "@/lib/cms/types";

function CompanyHeading({
  company,
  logoUrl,
  size = "sm",
}: {
  company: string;
  logoUrl?: string | null;
  size?: "sm" | "md";
}) {
  return (
    <div className="mt-3 flex min-w-0 items-center gap-3">
      <CompanyLogo src={logoUrl} company={company} size={size} />
      <h3
        className={
          size === "md"
            ? "min-w-0 text-3xl tracking-[-0.04em] sm:text-4xl"
            : "min-w-0 text-2xl tracking-[-0.03em]"
        }
      >
        {company}
      </h3>
    </div>
  );
}

export function Experience({
  settings,
  items,
}: {
  settings: SettingsRow;
  items: ExperienceRow[];
}) {
  const featured = items.find((item) => item.featured) || items[0];
  const others = items.filter((item) => item.id !== featured?.id);

  return (
    <Section
      id="experience"
      eyebrow="02 / Experience"
      title={settings.journey_title || "Professional journey"}
      description={settings.journey_description}
    >
      {featured ? (
        <Reveal>
          <article className="overflow-hidden rounded-[1.4rem] border border-border bg-bg-card p-6 shadow-[var(--shadow)] sm:p-8 lg:grid lg:grid-cols-[140px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:p-10">
            {experience.logo ? (
              <div className="mb-6 grid size-24 place-items-center rounded-2xl border border-border bg-white p-3 lg:mb-0 lg:size-[120px]">
                <Image
                  src={experience.logo}
                  alt={`${featured.company} mark`}
                  width={96}
                  height={96}
                  className="h-auto w-full object-contain"
                />
              </div>
            ) : (
              <div className="mb-6 hidden lg:block" />
            )}
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                {[featured.start_year, featured.end_year].filter(Boolean).join(" – ") || experience.tenure}
              </p>
              <CompanyHeading company={featured.company} logoUrl={featured.company_logo_url} size="md" />
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                {featured.position}
              </p>
              <p className="mt-5 max-w-2xl text-pretty text-muted">{featured.description}</p>
              {featured.technologies.length ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {featured.technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        </Reveal>
      ) : null}

      {others.map((item) => (
        <Reveal key={item.id}>
          <article className="mt-4 rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {[item.start_year, item.end_year].filter(Boolean).join(" – ")}
            </p>
            <CompanyHeading company={item.company} logoUrl={item.company_logo_url} />
            <p className="mt-2 text-sm text-muted">{item.position}</p>
            <p className="mt-4 max-w-2xl text-pretty text-muted">{item.description}</p>
          </article>
        </Reveal>
      ))}

      <ExperiencePhotos />

      <Stagger className="relative mt-12 grid gap-0 lg:grid-cols-4">
        <div className="pointer-events-none absolute top-7 right-8 left-8 hidden h-px bg-border lg:block" />
        {experience.stages.map((stage) => (
          <StaggerItem key={stage.title} className="relative border-t border-border py-8 lg:border-t-0 lg:px-4 lg:py-0">
            <span className="mb-5 hidden size-3 rounded-full border border-accent bg-bg lg:block" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
              {stage.label}
            </p>
            <h3 className="mt-3 text-xl tracking-[-0.03em]">{stage.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{stage.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
