import { emailHref, resolvedSocials, site } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function Contact() {
  const mail = emailHref();

  return (
    <Section
      id="contact"
      eyebrow="10 / Contact"
      title="Let’s Build Something Meaningful."
      description="Whether it’s a digital product, collaboration, content project, or simply a conversation about ideas."
    >
      <Reveal>
        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted">
          If something here resonates, write to me. I read every note — products,
          market conversations, collaborations, content, or a simple exchange of
          ideas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {mail ? (
            <ButtonLink href={mail} variant="primary">
              Email Me
            </ButtonLink>
          ) : null}
          <ButtonLink href="#content" variant="ghost">
            Connect
          </ButtonLink>
        </div>
        {site.email ? (
          <a href={mail} className="mt-4 inline-block text-sm text-muted hover:text-text">
            {site.email}
          </a>
        ) : null}
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {resolvedSocials().map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-20 flex-col justify-between rounded-[1.1rem] border border-border bg-bg-card px-4 py-4 text-sm transition-colors hover:border-accent/35"
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
      </Reveal>
    </Section>
  );
}
