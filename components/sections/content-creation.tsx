import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import type { SettingsRow, SocialRow } from "@/lib/cms/types";

export function ContentCreation({
  settings,
  socials: socialItems,
  eyebrow,
}: {
  settings: SettingsRow;
  socials: SocialRow[];
  eyebrow?: string;
}) {
  const youtube = socialItems.find((item) => item.platform.toLowerCase() === "youtube");
  const facebook = socialItems.find((item) => item.platform.toLowerCase().includes("facebook"));
  const instagram = socialItems.find((item) => item.platform.toLowerCase() === "instagram");
  const tiktok = socialItems.find((item) => item.platform.toLowerCase() === "tiktok");
  const youtubeHref = youtube?.href || "";
  const facebookHref = facebook?.href || settings.market_facebook_url || "";
  const themes = settings.content_themes || [];

  const channels = [
    {
      name: "YouTube",
      href: youtubeHref,
      note: youtube?.note || "YouTube",
      copy: youtube?.note || "Long-form and short-form stories from your work.",
    },
    {
      name: "Facebook",
      href: facebookHref,
      note: facebook?.note || "Facebook",
      copy: facebook?.note || "Updates, notes, and community conversations.",
    },
    {
      name: "Instagram",
      href: instagram?.href || "",
      note: instagram?.note || "Instagram",
      copy: instagram?.note || "Visual notes from projects and process.",
    },
    {
      name: "TikTok",
      href: tiktok?.href || "",
      note: tiktok?.note || "TikTok",
      copy: tiktok?.note || "Shorter cuts of the same ideas.",
    },
  ];

  return (
    <Section
      id="content"
      eyebrow={eyebrow || settings.content_eyebrow || "Creator"}
      title={settings.content_title || "Beyond the work. I create."}
      description={settings.content_description}
    >
      {youtubeHref || settings.content_youtube_title ? (
        <Reveal>
          <article className="mb-4 overflow-hidden rounded-[1.4rem] border border-border bg-bg-card p-6 sm:mb-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {settings.content_youtube_context || "Video channel"}
            </p>
            <h3 className="mt-3 text-2xl tracking-[-0.03em] sm:text-3xl">
              {settings.content_youtube_title}
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
              {settings.content_youtube_body}
            </p>
            {youtubeHref ? (
              <div className="mt-6">
                <ButtonLink href={youtubeHref} external>
                  {settings.content_youtube_cta || "Open channel"}
                </ButtonLink>
              </div>
            ) : null}
          </article>
        </Reveal>
      ) : null}

      {themes.length ? (
        <ul className="mb-10 flex flex-wrap gap-2">
          {themes.map((theme) => (
            <li
              key={theme}
              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
            >
              {theme}
            </li>
          ))}
        </ul>
      ) : null}

      <Stagger className="grid gap-4 md:grid-cols-2">
        {channels.filter((channel) => channel.href).map((channel) => (
          <StaggerItem key={channel.name}>
            <a
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
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
                Open channel
                <span className="hover-arrow ml-1">→</span>
              </p>
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
