import Image from "next/image";
import { ProjectPreview } from "@/components/projects/project-preview";
import { cn } from "@/lib/utils";

type Accent = "emerald" | "rose" | "amber";

export function ProjectCard({
  number,
  name,
  category,
  description,
  technologies,
  href,
  cta,
  accent,
  modules,
  image,
  featured = false,
}: {
  number: string;
  name: string;
  category: string;
  description: string;
  technologies: readonly string[];
  href: string;
  cta: string;
  accent: Accent;
  modules: readonly string[];
  image?: string;
  featured?: boolean;
}) {
  const Wrapper = href ? "a" : "article";
  const wrapperProps = href
    ? {
        href,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group block overflow-hidden rounded-[1.6rem] border border-border bg-bg-card p-5 transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[var(--shadow)] sm:p-7",
        featured && "lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-10 lg:p-8",
      )}
    >
      <div className={cn(featured && "lg:order-2")}>
        {image ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem] border border-border bg-bg-soft">
            <Image
              src={image}
              alt={`${name} visual`}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
              sizes={featured ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 768px) 100vw, 50vw"}
            />
          </div>
        ) : (
          <ProjectPreview name={name} accent={accent} modules={modules} />
        )}
      </div>
      <div className={cn("pt-6", featured ? "lg:order-1 lg:pt-0" : "sm:pt-7")}>
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-subtle">
            Project {number}
          </p>
          <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-accent">{category}</p>
        <h3 className="mt-2 text-3xl tracking-[-0.04em] sm:text-4xl">{name}</h3>
        <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted sm:text-base">
          {description}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle"
            >
              {tech}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-text">
          {href ? cta : "Live URL coming soon"}
          {href ? <span className="hover-arrow ml-1">→</span> : null}
        </p>
      </div>
    </Wrapper>
  );
}
