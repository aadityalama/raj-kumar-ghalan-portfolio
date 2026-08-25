import { Cursor } from "@/components/ui/cursor";
import { ScrollProgress } from "@/components/navigation/scroll-progress";
import { SiteHeader } from "@/components/navigation/site-header";
import { About } from "@/components/sections/about";
import { CareerTimeline } from "@/components/sections/career-timeline";
import { Contact } from "@/components/sections/contact";
import { ContentCreation } from "@/components/sections/content-creation";
import { Experience } from "@/components/sections/experience";
import { GalleryCta } from "@/components/sections/gallery-cta";
import { Market } from "@/components/sections/market";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { FireNepalCase } from "@/components/sections/fire-nepal-case";
import { Hero } from "@/components/sections/hero";
import { OtherProjects } from "@/components/sections/other-projects";
import { Philosophy } from "@/components/sections/philosophy";
import { SiteFooter } from "@/components/sections/site-footer";
import { Skills } from "@/components/sections/skills";
import {
  featuredPortrait,
  getPublicPortfolio,
  groupedSkills,
  isSectionVisible,
  navItems,
  socialByPlatform,
} from "@/lib/cms/public";

export default async function Home() {
  const portfolio = await getPublicPortfolio();
  const items = navItems(portfolio);
  const show = (key: string) => isSectionVisible(portfolio, key);
  const featuredProjects = portfolio.projects.filter((item) => item.featured);
  const otherProjects = portfolio.projects.filter((item) => !item.featured);
  const fireNepal = portfolio.projects.find((item) => item.title.toLowerCase().includes("fire nepal"));
  const nepseSocial =
    socialByPlatform(portfolio, "facebookNepse") ||
    portfolio.socials.find((item) => item.note.toLowerCase().includes("nepse"));

  return (
    <>
      <ScrollProgress />
      <SiteHeader items={items} />
      <Cursor />
      <main id="main">
        <Hero settings={portfolio.settings} portrait={featuredPortrait(portfolio)} />
        {show("about") ? <About settings={portfolio.settings} /> : null}
        {show("experience") ? (
          <Experience settings={portfolio.settings} items={portfolio.experience} />
        ) : null}
        {show("market") ? (
          <Market
            settings={portfolio.settings}
            facebookUrl={nepseSocial?.href || portfolio.settings.market_facebook_url}
          />
        ) : null}
        {show("projects") ? <FeaturedProjects items={featuredProjects.length ? featuredProjects : portfolio.projects.slice(0, 1)} /> : null}
        {show("projects") && fireNepal ? <FireNepalCase liveUrl={fireNepal.live_url} /> : null}
        {show("projects") ? (
          <OtherProjects items={featuredProjects.length ? otherProjects : portfolio.projects.slice(1)} />
        ) : null}
        {show("skills") ? <Skills groups={groupedSkills(portfolio.skills)} /> : null}
        {show("content") ? (
          <ContentCreation settings={portfolio.settings} socials={portfolio.socials} />
        ) : null}
        <CareerTimeline />
        {show("philosophy") ? <Philosophy text={portfolio.settings.philosophy} /> : null}
        {show("gallery") ? <GalleryCta /> : null}
        {show("contact") ? <Contact contact={portfolio.contact} socials={portfolio.socials} /> : null}
      </main>
      <SiteFooter
        positioning={portfolio.settings.hero_positioning}
        items={items}
        socials={portfolio.socials}
      />
    </>
  );
}
