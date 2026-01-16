import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Playfair_Display } from "next/font/google";

import "../styles/globals.css";

import Footer from "../components/sections/Footer";
import Navbar from "../components/sections/Navbar";
import I18nProvider from "../components/I18nProvider";
import { getServerT } from "../lib/i18n-server";
import { siteConfig } from "../lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Go & Glow"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/images/hero.png"]
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const t = await getServerT();
  return (
    <html lang="bn">
      <body className={`${serif.variable} ${sans.variable} font-sans`}>
        <a href="#main" className="skip-link">
          {t("accessibility.skipToContent")}
        </a>
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
