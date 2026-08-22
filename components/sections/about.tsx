import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { SettingsRow } from "@/lib/cms/types";

export function About({ settings }: { settings: SettingsRow }) {
  const titleLines = settings.about_title.split("\n").filter(Boolean);

  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <div className="hairline mx-auto max-w-[1180px]" />
      <Container className="pt-20 sm:pt-24 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-20">
          <Reveal>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              01 / About
            </p>
            <h2 className="display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.98] tracking-[-0.035em]">
              {titleLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < titleLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end">
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {settings.about_body}
            </p>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              {settings.about_body_secondary}
            </p>
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
                Known experience
              </p>
              <p className="mt-2 text-3xl tracking-[-0.04em]">
                {settings.about_experience_label || site.experienceLabel}
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
