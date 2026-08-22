import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function About() {
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
              A professional career.
              <br />
              A market analyst’s eye.
              <br />
              A builder’s mindset.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end">
            <p className="text-pretty text-base leading-relaxed text-muted sm:text-lg">
              I have spent more than a decade working as a professional in South
              Korea — learning discipline, precision, and how real systems
              operate. Alongside that career, I analyze the Nepal Stock Exchange
              as a market analyst, technical analyst, investor, and trader, and I
              build digital products: tools for financial independence, commerce,
              and everyday decisions.
            </p>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              The through-line is practical. I care about markets that people can
              read more clearly, technology they can use, and stories that travel
              between Nepal, Korea, and the work of making things.
            </p>
            <div className="mt-10 border-t border-border pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
                Known experience
              </p>
              <p className="mt-2 text-3xl tracking-[-0.04em]">{site.experienceLabel}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
