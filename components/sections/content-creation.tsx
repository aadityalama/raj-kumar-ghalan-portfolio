import { contentFocus, contentThemes, socials } from "@/config/site";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const channels = [
  {
    name: "YouTube",
    href: socials.youtube.href,
    note: socials.youtube.note,
    copy: "Long-form and short financial stories — education first.",
  },
  {
    name: "Facebook",
    href: socials.facebook.href,
    note: socials.facebook.note,
    copy: "Updates and conversations around FIRE Nepal, NEPSE, and daily money questions.",
  },
  {
    name: "Instagram",
    href: socials.instagram.href,
    note: socials.instagram.note,
    copy: "Visual notes from product, Nepal, and life in Korea.",
  },
  {
    name: "TikTok",
    href: socials.tiktok.href,
    note: socials.tiktok.note,
    copy: "Shorter cuts of the same ideas — finance, work, and building.",
  },
] as const;

export function ContentCreation() {
  return (
    <Section
      id="content"
      eyebrow="07 / Creator"
      title="Beyond Code. I Create."
      description="I also make digital and social content around NEPSE technical analysis, financial education, personal finance, Nepal, Korea, career, and the products I am building."
    >
      <Reveal>
        <article className="mb-10 overflow-hidden rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              Focus
            </p>
            <h3 className="mt-3 text-2xl tracking-[-0.03em] sm:text-3xl">
              {contentFocus.title}
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              {contentFocus.body}
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0">
            {contentFocus.stats.map((stat) => (
              <div key={stat.label} className="rounded-[1.1rem] border border-border bg-bg-soft px-4 py-4">
                <p className="text-3xl tracking-[-0.04em]">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
            <p className="col-span-2 text-xs text-subtle">{contentFocus.context}</p>
          </div>
        </article>
      </Reveal>
      <ul className="mb-10 flex flex-wrap gap-2">
        {contentThemes.map((theme) => (
          <li
            key={theme}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
          >
            {theme}
          </li>
        ))}
      </ul>

      <Stagger className="grid gap-4 md:grid-cols-2">
        {channels.map((channel) => {
          const Comp = channel.href ? "a" : "article";
          return (
            <StaggerItem key={channel.name}>
              <Comp
                href={channel.href || undefined}
                target={channel.href ? "_blank" : undefined}
                rel={channel.href ? "noopener noreferrer" : undefined}
                className="group flex min-h-[180px] flex-col justify-between rounded-[1.3rem] border border-border bg-bg-card p-6 transition-colors hover:border-accent/30"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
                    {channel.note}
                  </p>
                  <h3 className="mt-3 text-2xl tracking-[-0.03em]">{channel.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{channel.copy}</p>
                </div>
                <p className="mt-6 text-sm">
                  {channel.href ? "Open channel" : "Link coming soon"}
                  {channel.href ? <span className="hover-arrow ml-1">→</span> : null}
                </p>
              </Comp>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
