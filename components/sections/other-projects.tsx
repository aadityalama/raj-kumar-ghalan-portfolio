import { projects } from "@/config/site";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import type { ProjectRow } from "@/lib/cms/types";

const accents = ["rose", "amber", "emerald"] as const;

export function OtherProjects({ items }: { items: ProjectRow[] }) {
  if (!items.length) return null;

  return (
    <Section id="other-projects" eyebrow="05 / More work" title="Other projects">
      <Stagger className="grid gap-6 lg:grid-cols-2">
        {items.map((project, index) => {
          const fallback =
            project.title === projects.uvelyGlow.name
              ? { image: projects.uvelyGlow.image, modules: ["Storefront", "Discovery", "Skincare quiz", "Account"] }
              : project.title === projects.nepDealz.name
                ? { image: projects.nepDealz.image, modules: ["Catalog", "Offers", "Checkout", "Commerce"] }
                : { image: "", modules: project.technologies };
          return (
            <StaggerItem key={project.id} className={index === 1 ? "lg:mt-16" : undefined}>
              <ProjectCard
                number={String(index + 2).padStart(2, "0")}
                name={project.title}
                category={project.category}
                description={project.description}
                technologies={project.technologies}
                href={project.live_url}
                githubUrl={project.github_url}
                youtubeUrl={project.youtube_url}
                cta={project.live_url ? `Visit ${project.title}` : "View project"}
                accent={accents[index % accents.length]}
                modules={fallback.modules}
                image={project.image_url || fallback.image}
              />
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
