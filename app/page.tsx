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
import { FeaturedProductCase } from "@/components/sections/featured-product-case";
import { Hero } from "@/components/sections/hero";
import { OtherProjects } from "@/components/sections/other-projects";
import { Philosophy } from "@/components/sections/philosophy";
import { SiteFooter } from "@/components/sections/site-footer";
import { Skills } from "@/components/sections/skills";
import { brandWordmark } from "@/lib/cms/branding";
import {
  featuredPortrait,
  getPublicPortfolio,
  groupedSkills,
  isSectionVisible,
  journeyStagesByKind,
  navItems,
  sectionMeta,
  socialByPlatform,
} from "@/lib/cms/public";

export default async function Home() {
  const portfolio = await getPublicPortfolio();
  const items = navItems(portfolio);
  const show = (key: string) => isSectionVisible(portfolio, key);
  const featuredProjects = portfolio.projects.filter((item) => item.featured);
  const otherProjects = portfolio.projects.filter((item) => !item.featured);
  const spotlightSocial =
    socialByPlatform(portfolio, "facebook") ||
    portfolio.socials.find((item) => item.href);
  const wordmark = brandWordmark(portfolio.settings);
  const showProduct =
    show("product") ||
    (show("projects") &&
      (portfolio.productCards.length > 0 ||
        portfolio.productFeatures.length > 0 ||
        Boolean(portfolio.productSettings.case_title)));

  const aboutMeta = sectionMeta(portfolio, "about");
  const experienceMeta = sectionMeta(portfolio, "experience");
  const projectsMeta = sectionMeta(portfolio, "projects", {
    eyebrow: "03 / Work",
    title: "Selected work",
    description: "Projects that show how ideas become usable products.",
  });
  const skillsMeta = sectionMeta(portfolio, "skills", {
    eyebrow: "06 / Capabilities",
    title: "What I Work With",
    description:
      "A working set of product, technology, markets, AI, and content skills — used to ship real things, not a logo wall.",
  });
  const contentMeta = sectionMeta(portfolio, "content");
  const marketMeta = sectionMeta(portfolio, "market");
  const careerStages = journeyStagesByKind(portfolio, "career");
  const experienceStages = journeyStagesByKind(portfolio, "experience");

  return (
    <>
      <ScrollProgress />
      <SiteHeader items={items} wordmark={wordmark} />
      <Cursor />
      <main id="main">
        <Hero settings={portfolio.settings} portrait={featuredPortrait(portfolio)} />
        {show("about") ? (
          <About
            settings={portfolio.settings}
            eyebrow={aboutMeta.eyebrow || portfolio.settings.about_eyebrow}
          />
        ) : null}
        {show("experience") ? (
          <Experience
            settings={portfolio.settings}
            items={portfolio.experience}
            stages={experienceStages}
            photos={portfolio.experiencePhotos}
            eyebrow={experienceMeta.eyebrow}
          />
        ) : null}
        {show("market") ? (
          <Market
            settings={portfolio.settings}
            facebookUrl={spotlightSocial?.href || portfolio.settings.market_facebook_url}
            eyebrow={marketMeta.eyebrow}
          />
        ) : null}
        {show("projects") ? (
          <FeaturedProjects
            items={featuredProjects.length ? featuredProjects : portfolio.projects.slice(0, 1)}
            eyebrow={projectsMeta.eyebrow}
            title={projectsMeta.title}
            description={projectsMeta.description}
          />
        ) : null}
        {showProduct ? (
          <FeaturedProductCase
            settings={portfolio.productSettings}
            productCards={portfolio.productCards}
            productFeatures={portfolio.productFeatures}
          />
        ) : null}
        {show("projects") ? (
          <OtherProjects
            items={featuredProjects.length ? otherProjects : portfolio.projects.slice(1)}
            eyebrow={portfolio.settings.other_projects_eyebrow}
            title={portfolio.settings.other_projects_title}
          />
        ) : null}
        {show("skills") ? (
          <Skills
            groups={groupedSkills(portfolio.skills)}
            eyebrow={skillsMeta.eyebrow}
            title={skillsMeta.title}
            description={skillsMeta.description}
          />
        ) : null}
        {show("content") ? (
          <ContentCreation
            settings={portfolio.settings}
            socials={portfolio.socials}
            eyebrow={contentMeta.eyebrow}
          />
        ) : null}
        {show("experience") ? (
          <CareerTimeline settings={portfolio.settings} stages={careerStages} />
        ) : null}
        {show("philosophy") ? <Philosophy text={portfolio.settings.philosophy} /> : null}
        {show("gallery") ? <GalleryCta settings={portfolio.settings} /> : null}
        {show("contact") ? <Contact contact={portfolio.contact} socials={portfolio.socials} /> : null}
      </main>
      <SiteFooter
        positioning={portfolio.settings.hero_positioning}
        items={items}
        socials={portfolio.socials}
        wordmark={wordmark}
        copyrightText={portfolio.settings.copyright_text}
      />
    </>
  );
}
