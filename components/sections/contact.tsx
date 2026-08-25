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
  const channels = socialItems.filter((item) => item.href && item.platform.toLowerCase() !== "email");

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s connect."
      description="Whether it’s a project, collaboration, or a simple exchange of ideas."
    >
      <Reveal>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <article className="rounded-[1.4rem] border border-border bg-bg-card p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Email</p>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted">
              {contact.message}
            </p>
            {contact.email ? (
              <a
                href={mail}
                className="mt-6 inline-block text-lg tracking-[-0.03em] text-text underline-offset-4 hover:underline"
              >
                {contact.email}
              </a>
            ) : null}
            {contact.location ? (
              <p className="mt-4 text-sm text-subtle">{contact.location}</p>
            ) : null}
            {mail ? (
              <div className="mt-8">
                <ButtonLink href={mail}>Write a message</ButtonLink>
              </div>
            ) : null}
          </article>
          <article className="rounded-[1.4rem] border border-border bg-bg-elevated p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">Elsewhere</p>
            <ul className="mt-5 grid gap-3">
              {channels.map((item) => (
                <li key={`${item.platform}-${item.href}`}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 rounded-[1rem] border border-border px-4 py-3 text-sm transition-colors hover:border-accent/40"
                  >
                    <span>{item.label}</span>
                    <span className="text-subtle">{item.note || "Open"}</span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Reveal>
    </Section>
  );
}
