import { site, socials } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { ContactRow, SocialRow } from "@/lib/cms/types";

export function Contact({
  contact,
  socials: socialItems,
}: {
  contact: ContactRow;
  socials: SocialRow[];
}) {
  const mail = contact.email ? `mailto:${contact.email}` : "";
  const youtube = socialItems.find((item) => item.platform.toLowerCase() === "youtube")?.href || socials.youtube.href;
  const facebook =
    socialItems.find((item) => item.platform.toLowerCase() === "facebooknepse")?.href ||
    socialItems.find((item) => item.note.toLowerCase().includes("nepse"))?.href ||
    socials.facebookNepse.href;
  const channels = socialItems.filter((item) => item.href && item.platform.toLowerCase() !== "email");

  return (
    <Section
      id="contact"
      eyebrow="10 / Contact"
      title="Let’s Build Something Meaningful."
      description="Whether it’s a digital product, a market conversation, a collaboration, or a content project."
    >
      <Reveal>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <article className="rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              Email
            </p>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted">
              {contact.message}
            </p>
            {contact.email ? (
              <a
                href={mail}
                className="mt-6 block text-xl tracking-[-0.03em] text-text sm:text-2xl"
              >
                {contact.email}
              </a>
            ) : null}
            {contact.phone || contact.location ? (
              <p className="mt-3 text-sm text-muted">
                {[contact.location || site.location, contact.phone].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {mail ? (
                <ButtonLink href={mail} variant="primary">
                  Email Me
                </ButtonLink>
              ) : null}
              <ButtonLink href={youtube} external variant="ghost">
                YouTube
              </ButtonLink>
              <ButtonLink href={facebook} external variant="ghost">
                Facebook
              </ButtonLink>
            </div>
          </article>
          <ul className="grid grid-cols-2 gap-3">
            {channels.map((item) => (
              <li key={`${item.platform}-${item.href}`}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[7.5rem] flex-col justify-between rounded-[1.2rem] border border-border bg-bg-card px-4 py-4 text-sm transition-colors hover:border-accent/35"
                >
                  <span className="text-subtle">{item.note}</span>
                  <span className="mt-3 tracking-[-0.02em]">
                    {item.label}
                    <span className="hover-arrow ml-1">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
