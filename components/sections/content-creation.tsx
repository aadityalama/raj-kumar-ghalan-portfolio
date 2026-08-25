import { contentFocus, contentThemes, socials, youtubeFocus } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import type { SettingsRow, SocialRow } from "@/lib/cms/types";

export function ContentCreation({
  settings,
  socials: socialItems,
}: {
  settings: SettingsRow;
  socials: SocialRow[];
}) {
  const youtube = socialItems.find((item) => item.platform.toLowerCase() === "youtube");
  const facebookNepse =
    socialItems.find((item) => item.platform.toLowerCase() === "facebooknepse") ||
    socialItems.find((item) => item.note.toLowerCase().includes("nepse"));
  const instagram = socialItems.find((item) => item.platform.toLowerCase() === "instagram");
  const tiktok = socialItems.find((item) => item.platform.toLowerCase() === "tiktok");
  const youtubeHref = youtube?.href || youtubeFocus.href;
  const facebookHref = facebookNepse?.href || settings.market_facebook_url || socials.facebookNepse.href;

  const channels = [
    {
      name: "YouTube",
      href: youtubeHref,
      note: youtube?.note || socials.youtube.note,
      copy: "Long-form and short financial stories — education first.",
    },
    {
      name: "Facebook",
      href: facebookHref,
      note: facebookNepse?.note || socials.facebookNepse.note,
      copy: "NEPSE technical analysis, Nepali share market trends, and educational notes from active investing and trading.",
    },
    {
      name: "Instagram",
      href: instagram?.href || socials.instagram.href,
      note: instagram?.note || socials.instagram.note,
      copy: "Visual notes from product, Nepal, and life in Korea.",
    },
    {
      name: "TikTok",
      href: tiktok?.href || socials.tiktok.href,
      note: tiktok?.note || socials.tiktok.note,
      copy: "Shorter cuts of the same ideas — finance, work, and building.",
    },
  ];

  return (
    <Section
      id="content"
      eyebrow="07 / Creator"
      title={settings.content_title || "Beyond Code. I Create."}
      description={settings.content_description}
    >
      <Reveal>
        <article className="mb-4 overflow-hidden rounded-[1.4rem] border border-border bg-bg-card p-6 sm:mb-6 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {youtubeFocus.context}
            </p>
            <h3 className="mt-3 text-2xl tracking-[-0.03em] sm:text-3xl">
              {settings.content_youtube_title || youtubeFocus.title}
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              {settings.content_youtube_body || youtubeFocus.body}
            </p>
            <div className="mt-6">
              <ButtonLink href={youtubeHref} external>
                {youtubeFocus.cta}
              </ButtonLink>
            </div>
          </div>
        </article>
      </Reveal>
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
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center text-sm text-text"
            >
              Open Facebook page
              <span className="hover-arrow ml-1">→</span>
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:mt-0">
            {[
              { value: settings.market_followers || "11K+", label: "Followers" },
              { value: settings.market_posts || "231+", label: "Posts" },
            ].map((stat) => (
              <a
                key={stat.label}
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[1.1rem] border border-border bg-bg-soft px-4 py-4 transition-colors hover:border-accent/35"
              >
                <p className="text-3xl tracking-[-0.04em]">{stat.value}</p>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </a>
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
