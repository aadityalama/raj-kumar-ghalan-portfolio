import { brandDisplayName } from "@/lib/cms/branding";
import type { PublicPortfolio } from "@/lib/cms/types";
import { site as fallbackSite } from "@/config/site";

export function personJsonLd(portfolio?: PublicPortfolio) {
  const settings = portfolio?.settings;
  const contact = portfolio?.contact;
  const socials = portfolio?.socials || [];
  const name = settings ? brandDisplayName(settings) : fallbackSite.name;
  const description =
    portfolio?.seo.meta_description || settings?.hero_body || fallbackSite.description;
  const url = settings?.site_url || fallbackSite.url;
  const image = settings?.hero_image_url
    ? settings.hero_image_url.startsWith("http")
      ? settings.hero_image_url
      : `${url}${settings.hero_image_url}`
    : undefined;
  const sameAs = socials.map((item) => item.href).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: settings?.hero_positioning || fallbackSite.positioning,
    description,
    url,
    email: contact?.email || undefined,
    image,
    sameAs,
  };
}

export function websiteJsonLd(portfolio?: PublicPortfolio) {
  const settings = portfolio?.settings;
  const name = settings ? brandDisplayName(settings) : fallbackSite.name;
  const url = settings?.site_url || fallbackSite.url;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description: portfolio?.seo.meta_description || fallbackSite.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name,
    },
  };
}
