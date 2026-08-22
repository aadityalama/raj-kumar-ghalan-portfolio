import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-20 sm:py-24 lg:py-32", className)}
    >
      <Container>
        {(eyebrow || title || description) && (
          <header className="mb-12 max-w-3xl sm:mb-16">
            {eyebrow ? (
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="text-balance text-[clamp(2rem,4.6vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
