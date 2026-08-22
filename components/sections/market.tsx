import { market } from "@/config/site";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

export function Market() {
  return (
    <Section
      id="market"
      eyebrow={market.eyebrow}
      title={market.title}
      description={market.description}
    >
      <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {market.capabilities.map((item, index) => (
          <StaggerItem key={item}>
            <article className="min-h-[140px] rounded-[1.2rem] border border-border bg-bg-card px-5 py-6">
              <p className="font-mono text-[11px] text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-lg tracking-[-0.03em]">{item}</h3>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
      <Reveal>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-subtle">
          {market.note}
        </p>
      </Reveal>
    </Section>
  );
}
