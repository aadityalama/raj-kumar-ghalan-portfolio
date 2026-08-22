import { philosophy as defaultPhilosophy } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function Philosophy({ text }: { text: string }) {
  return (
    <section id="philosophy" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--accent-glow),transparent_42%)]" />
      <Container className="relative">
        <Reveal>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            09 / Personal philosophy
          </p>
          <h2 className="display max-w-4xl text-[clamp(2rem,5.4vw,4.6rem)] leading-[1.05] tracking-[-0.035em]">
            {text || defaultPhilosophy}
          </h2>
        </Reveal>
      </Container>
    </section>
  );
}
