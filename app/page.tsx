import { Cursor } from "@/components/ui/cursor";
import { ScrollProgress } from "@/components/navigation/scroll-progress";
import { SiteHeader } from "@/components/navigation/site-header";
import { About } from "@/components/sections/about";
import { CareerTimeline } from "@/components/sections/career-timeline";
import { Contact } from "@/components/sections/contact";
import { ContentCreation } from "@/components/sections/content-creation";
import { Experience } from "@/components/sections/experience";
import { LifeGallery } from "@/components/sections/life-gallery";
import { Market } from "@/components/sections/market";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FireNepalCase } from "@/components/sections/fire-nepal-case";
import { Hero } from "@/components/sections/hero";
import { OtherProjects } from "@/components/sections/other-projects";
import { Philosophy } from "@/components/sections/philosophy";
import { SiteFooter } from "@/components/sections/site-footer";
import { Skills } from "@/components/sections/skills";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <Cursor />
      <main id="main">
        <Hero />
        <About />
        <LifeGallery />
        <Experience />
        <Market />
        <FeaturedProjects />
        <FireNepalCase />
        <OtherProjects />
        <Skills />
        <ContentCreation />
        <CareerTimeline />
        <Philosophy />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
