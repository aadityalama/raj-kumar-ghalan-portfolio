import { projects } from "@/config/site";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import type { ProjectRow } from "@/lib/cms/types";

const accents = ["emerald", "rose", "amber"] as const;

export function FeaturedProjects({ items }: { items: ProjectRow[] }) {
  if (!items.length) return null;

  return (
    <Section
      id="projects"
      eyebrow="03 / Work"
      title="Things I’m Building"
      description="From NEPSE analysis and financial independence to digital commerce, I build products around real-world problems."
    >
      {items.map((project, index) => {
        const fallback = project.title === projects.fireNepal.name ? projects.fireNepal : null;
        return (
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
                modules={fallback?.productAreas || project.technologies}
                image={project.image_url || fallback?.image}
              />
            </div>
          </Reveal>
        );
      })}
    </Section>
  );
}
