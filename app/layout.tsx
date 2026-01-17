import type { ReactNode } from "react";
import { Manrope, Playfair_Display } from "next/font/google";

import "../styles/globals.css";

import Footer from "../components/sections/Footer";
import Navbar from "../components/sections/Navbar";
import I18nProvider from "../components/I18nProvider";
import { getServerT } from "../lib/i18n-server";
import { defaultSiteConfig, getSiteConfig } from "../lib/site";
import JsonLd from "../components/seo/JsonLd";
import FacebookPixel from "../components/analytics/FacebookPixel";
import UtmCapture from "../components/analytics/UtmCapture";
import { activeThemeClass } from "../lib/theme-config";
import { buildLocalBusinessJsonLd, buildServiceJsonLd } from "../lib/jsonld";
import { getServicesData } from "../lib/services-data";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap"
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export async function generateMetadata() {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.name,
      template: `%s | ${site.name}`
    },
    description: site.description,
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: site.name,
      description: site.description,
      url: site.url,
      siteName: site.name,
      locale: "bn_BD",
      type: "website",
      images: [
        {
          url: "/images/hero.png",
          width: 1200,
          height: 630,
          alt: site.name
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: ["/images/hero.png"]
    }
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const t = await getServerT();
  const site = await getSiteConfig();
  const services = await getServicesData();
  const pixelId = process.env.PIXEL_ID || process.env.NEXT_PUBLIC_PIXEL_ID || site.pixelId;
  const resolvedSite = { ...defaultSiteConfig, ...site };
  return (
    <html lang="bn">
      <body className={`${serif.variable} ${sans.variable} ${activeThemeClass} font-sans`}>
        <a href="#main" className="skip-link">
          {t("accessibility.skipToContent")}
        </a>
        <JsonLd id="local-business-jsonld" data={buildLocalBusinessJsonLd(resolvedSite)} />
        <JsonLd id="service-jsonld" data={buildServiceJsonLd(resolvedSite, services)} />
        <FacebookPixel pixelId={pixelId} />
        <UtmCapture />
        <I18nProvider>
          <div className="relative overflow-hidden">
            <Navbar />
            <main id="main" className="relative">
              {children}
            </main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
