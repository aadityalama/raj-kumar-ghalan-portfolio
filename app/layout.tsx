import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { site } from "@/config/site";
import { brandDisplayName, sanitizeAccentColor } from "@/lib/cms/branding";
import { getPublicPortfolio } from "@/lib/cms/public";
import { personJsonLd, websiteJsonLd } from "@/lib/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPublicPortfolio();
  const { seo, settings } = portfolio;
  const name = brandDisplayName(settings);
  const title = seo.site_title || site.title;
  const description = seo.meta_description || site.description;
  const ogTitle = seo.og_title || title;
  const ogDescription = seo.og_description || description;
  const ogImage = seo.og_image || settings.hero_image_url || site.portrait.src;
  const canonicalBase = settings.site_url || site.url;

  return {
    metadataBase: new URL(canonicalBase),
    title: {
      default: title,
      template: `%s · ${name}`,
    },
    description,
    keywords: seo.keywords.length ? seo.keywords : [...site.keywords],
    applicationName: settings.website_name || name,
    authors: [{ name, url: canonicalBase }],
    creator: name,
    publisher: name,
    alternates: {
      canonical: "/",
    },
    icons: settings.favicon_url
      ? { icon: settings.favicon_url }
      : undefined,
    openGraph: {
      type: "website",
      locale: site.locale,
      url: "/",
      title: ogTitle,
      description: ogDescription,
      siteName: settings.website_name || name,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#F6F4EF" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const portfolio = await getPublicPortfolio();
  const accent = sanitizeAccentColor(portfolio.settings.accent_color);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrument.variable} h-full antialiased dark`}
      style={{ ["--accent" as string]: accent }}
    >
      <body className="min-h-full bg-bg text-text" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personJsonLd(portfolio), websiteJsonLd(portfolio)]),
          }}
        />
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <div className="grain" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
