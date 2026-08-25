import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { JourneyStageRow, SettingsRow } from "@/lib/cms/types";

export function CareerTimeline({
  settings,
  stages,
}: {
  settings: SettingsRow;
  stages: JourneyStageRow[];
}) {
  if (!stages.length) return null;

  return (
    <section id="journey" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-24 lg:py-32">
      <Container>
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            {settings.career_timeline_eyebrow || "Path"}
          </p>
          <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.05] tracking-[-0.04em]">
            {settings.career_timeline_title || "The journey so far"}
          </h2>
        </Reveal>
      </Container>

      <div className="mt-12 lg:overflow-x-auto">
        <ol className="mx-auto flex max-w-[1180px] flex-col gap-0 px-5 sm:px-6 lg:w-max lg:min-w-full lg:flex-row lg:px-8">
          {stages.map((item, index) => (
            <li
              key={item.id}
              className="relative border-l border-border py-6 pl-6 lg:w-[240px] lg:border-l-0 lg:border-t lg:py-10 lg:pl-0 lg:pr-10"
            >
              <span className="absolute top-8 -left-[5px] size-2.5 rounded-full bg-accent lg:top-[-5px] lg:left-0" />
              <p className="font-mono text-[11px] text-subtle">{item.stage_label}</p>
              <h3 className="mt-3 text-xl tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
              {index < stages.length - 1 ? (
                <span className="sr-only">Next</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
