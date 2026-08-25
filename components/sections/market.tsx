import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import type { SettingsRow } from "@/lib/cms/types";

export function Market({
  settings,
  facebookUrl,
  eyebrow,
}: {
  settings: SettingsRow;
  facebookUrl: string;
  eyebrow?: string;
}) {
  const href = facebookUrl || settings.market_facebook_url || "";
  const capabilities = settings.market_capabilities || [];
  const stats = [
    {
      value: settings.market_followers || "—",
      label: settings.market_followers_label || "Followers",
    },
    {
      value: settings.market_posts || "—",
      label: settings.market_posts_label || "Posts",
    },
  ];

  return (
    <Section
      id="market"
      eyebrow={eyebrow || settings.market_eyebrow || "Spotlight"}
      title={settings.market_title}
      description={settings.market_description}
    >
      <Reveal>
        <article className="mb-10 rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(220px,0.75fr)] lg:items-end lg:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {settings.market_eyebrow || eyebrow || "Spotlight"}
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              {settings.market_profile}
            </p>
            {href ? (
              <div className="mt-6">
                <ButtonLink href={href} external>
                  {settings.market_facebook_cta || "Open profile"}
                </ButtonLink>
              </div>
            ) : null}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 lg:mt-0">
            {stats.map((stat) => (
              <a
                key={stat.label}
                href={href || undefined}
                target={href ? "_blank" : undefined}
                rel={href ? "noopener noreferrer" : undefined}
                className="rounded-[1.1rem] border border-border bg-bg-soft px-4 py-4 transition-colors hover:border-accent/35"
              >
                <p className="text-3xl tracking-[-0.04em]">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </a>
            ))}
          </div>
        </article>
      </Reveal>

      {capabilities.length ? (
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item, index) => (
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
      ) : null}
      <Reveal>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-subtle">
          {settings.market_note}
        </p>
      </Reveal>
    </Section>
  );
}
