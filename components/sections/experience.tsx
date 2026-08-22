import Image from "next/image";
import { experience } from "@/config/site";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { ExperiencePhotos } from "@/components/sections/experience-photos";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="02 / Experience"
      title="Professional journey"
      description="Industrial craft first. Digital products next. The same standard: do the work carefully."
    >
      <Reveal>
        <article className="overflow-hidden rounded-[1.4rem] border border-border bg-bg-card p-6 shadow-[var(--shadow)] sm:p-8 lg:grid lg:grid-cols-[140px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:p-10">
          <div className="mb-6 grid size-24 place-items-center rounded-2xl border border-border bg-white p-3 lg:mb-0 lg:size-[120px]">
            <Image
              src={experience.logo}
              alt={`${experience.company} mark`}
              width={96}
              height={96}
              className="h-auto w-full object-contain"
            />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
              {experience.tenure}
            </p>
            <h3 className="mt-3 text-3xl tracking-[-0.04em] sm:text-4xl">{experience.company}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {experience.role}
            </p>
            <p className="mt-5 max-w-2xl text-pretty text-muted">{experience.summary}</p>
          </div>
        </article>
      </Reveal>

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
