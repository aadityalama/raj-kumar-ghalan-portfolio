import type { Metadata } from "next";
import { Cursor } from "@/components/ui/cursor";
import { ScrollProgress } from "@/components/navigation/scroll-progress";
import { SiteHeader } from "@/components/navigation/site-header";
import { PhotoGallery } from "@/components/sections/photo-gallery";
import { SiteFooter } from "@/components/sections/site-footer";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { brandDisplayName, brandWordmark } from "@/lib/cms/branding";
import {
  getPublicGallery,
  getPublicPortfolio,
  navItems,
} from "@/lib/cms/public";

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPublicPortfolio();
  const name = brandDisplayName(portfolio.settings);
  const galleryTitle = `Photo Gallery | ${name}`;
  const galleryDescription =
    name === site.name
      ? "Explore photos from Raj Kumar Ghalan's professional journey, projects, work, and experiences."
      : `Explore photos from ${name}'s work, projects, and experiences.`;

  return {
    title: {
      absolute: galleryTitle,
    },
    description: galleryDescription,
    alternates: {
      canonical: "/gallery",
    },
    openGraph: {
      type: "website",
      locale: site.locale,
      url: "/gallery",
      title: galleryTitle,
      description: galleryDescription,
      siteName: portfolio.settings.website_name || name,
    },
    twitter: {
      card: "summary_large_image",
      title: galleryTitle,
      description: galleryDescription,
    },
  };
}

export default async function GalleryPage() {
  const [portfolio, photos] = await Promise.all([
    getPublicPortfolio(),
    getPublicGallery(),
  ]);
  const items = navItems(portfolio);
  const wordmark = brandWordmark(portfolio.settings);

  return (
    <>
      <ScrollProgress />
      <SiteHeader items={items} wordmark={wordmark} />
      <Cursor />
      <main id="main" className="pt-[var(--nav-height)]">
        <section className="relative scroll-mt-24 py-16 sm:py-20 lg:py-28">
          <Container>
            <header className="mb-12 max-w-3xl sm:mb-16">
              <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
                Photo Gallery
              </p>
              <h1 className="text-balance text-[clamp(2rem,4.6vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.04em]">
                Moments from the work, the journey, and the build.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
                A collection of photographs from projects, professional life, and experiences —
                managed from the admin gallery and kept current as new frames are published.
              </p>
            </header>
            <PhotoGallery photos={photos} />
          </Container>
        </section>
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
