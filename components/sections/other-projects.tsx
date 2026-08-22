import { projects } from "@/config/site";
import { ProjectCard } from "@/components/projects/project-card";
import { Section } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

export function OtherProjects() {
  return (
    <Section id="other-projects" eyebrow="05 / More work" title="Other projects">
      <Stagger className="grid gap-6 lg:grid-cols-2">
        <StaggerItem>
          <ProjectCard
            number={projects.uvelyGlow.number}
            name={projects.uvelyGlow.name}
            category={projects.uvelyGlow.category}
            description={projects.uvelyGlow.description}
            technologies={projects.uvelyGlow.technologies}
            href={projects.uvelyGlow.href}
            cta="Visit Uvely Glow"
            accent={projects.uvelyGlow.accent}
            modules={["Storefront", "Discovery", "Skincare quiz", "Account"]}
            image={projects.uvelyGlow.image}
          />
        </StaggerItem>
        <StaggerItem className="lg:mt-16">
          <ProjectCard
            number={projects.nepDealz.number}
            name={projects.nepDealz.name}
            category={projects.nepDealz.category}
            description={projects.nepDealz.description}
            technologies={projects.nepDealz.technologies}
            href={projects.nepDealz.href}
            cta="Visit NepDealz"
            accent={projects.nepDealz.accent}
            modules={["Catalog", "Offers", "Checkout", "Commerce"]}
          />
        </StaggerItem>
      </Stagger>
    </Section>
  );
}
