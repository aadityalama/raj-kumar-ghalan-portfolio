import { projects } from "@/config/site";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

export function FeaturedProjects() {
  const project = projects.fireNepal;

  return (
    <Section
      id="projects"
      eyebrow="03 / Work"
      title="Things I’m Building"
      description="From NEPSE analysis and financial independence to digital commerce, I build products around real-world problems."
    >
      <Reveal>
        <ProjectCard
          featured
          number={project.number}
          name={project.name}
          category={project.category}
          description={project.description}
          technologies={project.technologies}
          href={project.href}
          cta="Explore FIRE Nepal"
          accent={project.accent}
          modules={project.productAreas}
          image={project.image}
        />
      </Reveal>
    </Section>
  );
}
