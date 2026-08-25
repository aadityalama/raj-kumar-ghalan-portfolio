import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { ProjectRow } from "@/lib/cms/types";

const accents = ["emerald", "rose", "amber"] as const;

export function FeaturedProjects({
  items,
  eyebrow = "03 / Work",
  title = "Selected work",
  description = "Projects that show how ideas become usable products.",
}: {
  items: ProjectRow[];
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  if (!items.length) return null;

  return (
    <Section id="projects" eyebrow={eyebrow} title={title} description={description}>
      {items.map((project, index) => (
        <Reveal key={project.id}>
          <div className={index > 0 ? "mt-6" : undefined}>
            <ProjectCard
              featured
              number={String(index + 1).padStart(2, "0")}
              name={project.title}
              category={project.category}
              description={project.description}
              technologies={project.technologies}
              href={project.live_url}
              githubUrl={project.github_url}
              youtubeUrl={project.youtube_url}
              cta={project.live_url ? "Live Project" : "View project"}
              accent={accents[index % accents.length]}
              modules={project.technologies}
              image={project.image_url}
            />
          </div>
        </Reveal>
      ))}
    </Section>
  );
}
