import { site, socials } from "@/config/site";

export function personJsonLd() {
  const sameAs = [
    socials.youtube.href,
    socials.facebook.href,
    socials.instagram.href,
    socials.tiktok.href,
    socials.linkedin.href,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Market Analyst, Technical Analyst, Digital Builder, Creator",
    description: site.description,
    url: site.url,
    email: site.email || undefined,
    image: `${site.url}${site.portrait.src}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
    },
    knowsAbout: [
      "NEPSE",
      "Technical analysis",
      "Market analysis",
      "Investor education",
      "Digital products",
      "Personal finance",
      "Financial technology",
      "Content creation",
    ],
    sameAs,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FIRE Nepal",
    url: "https://www.firenepal.com",
    founder: {
      "@type": "Person",
      name: site.name,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: {
      "@type": "Person",
      name: site.name,
    },
  };
}
