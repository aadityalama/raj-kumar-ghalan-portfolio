import Image from "next/image";
import { site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { SettingsRow } from "@/lib/cms/types";

function HeroName({ title }: { title: string }) {
  const lines = title.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return (
      <>
        {lines[0]}
        {lines.slice(1).map((line) => (
          <span key={line} className="block text-muted">
            {line}
          </span>
        ))}
      </>
    );
  }

  const parts = title.trim().split(/\s+/);
  if (parts.length > 1) {
    return (
      <>
        {parts.slice(0, -1).join(" ")}
        <span className="block text-muted">{parts.at(-1)}</span>
      </>
    );
  }

  return title;
}

export function Hero({
  settings,
  portrait,
}: {
  settings: SettingsRow;
  portrait: { src: string; alt: string };
}) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-[calc(var(--nav-height)+2.5rem)] pb-16 sm:pb-24 lg:pt-[calc(var(--nav-height)+4.5rem)]"
    >
      <div className="pointer-events-none absolute inset-0 grid-field opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_68%)] blur-2xl" />

      <Container className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-12">
        <div>
          <p className="hero-rise mb-6 font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
            {settings.hero_positioning || site.positioning}
          </p>
          <h1 className="hero-rise max-w-[12ch] text-[clamp(3.1rem,9.2vw,7.25rem)] font-medium leading-[0.96] tracking-[-0.06em] [animation-delay:80ms]">
            <HeroName title={settings.hero_title || site.name} />
          </h1>
          <p className="hero-rise mt-8 max-w-xl text-xl leading-snug tracking-[-0.03em] text-text [animation-delay:140ms] sm:text-2xl">
            {settings.hero_subtitle || site.headline}
          </p>
          <p className="hero-rise mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted [animation-delay:200ms]">
            {settings.hero_body}
          </p>
          <div className="hero-rise mt-9 flex flex-wrap gap-3 [animation-delay:260ms]">
            <ButtonLink href="#projects">View My Work</ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              Let’s Connect
            </ButtonLink>
          </div>
        </div>

        <div className="hero-rise relative mx-auto w-full max-w-[420px] [animation-delay:180ms] lg:max-w-none">
          <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,var(--accent-glow),transparent_64%)] opacity-80" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[1.8rem] border border-border bg-bg-card shadow-[var(--shadow)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                className="object-cover object-[center_18%]"
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
