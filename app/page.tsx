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
  navItems,
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

  return (
    <>
      <ScrollProgress />
      <SiteHeader items={items} wordmark={wordmark} />
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
            facebookUrl={spotlightSocial?.href || portfolio.settings.market_facebook_url}
          />
        ) : null}
        {show("projects") ? (
          <FeaturedProjects
            items={featuredProjects.length ? featuredProjects : portfolio.projects.slice(0, 1)}
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
          <OtherProjects items={featuredProjects.length ? otherProjects : portfolio.projects.slice(1)} />
        ) : null}
        {show("skills") ? <Skills groups={groupedSkills(portfolio.skills)} /> : null}
        {show("content") ? (
          <ContentCreation settings={portfolio.settings} socials={portfolio.socials} />
        ) : null}
        {show("experience") ? <CareerTimeline /> : null}
        {show("philosophy") ? <Philosophy text={portfolio.settings.philosophy} /> : null}
        {show("gallery") ? <GalleryCta /> : null}
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
