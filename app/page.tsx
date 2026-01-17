import type { Metadata } from "next";

import BlogPreview from "../components/sections/BlogPreview";
import FAQ from "../components/sections/FAQ";
import Hero from "../components/sections/Hero";
import MeetTeam from "../components/sections/MeetTeam";
import PortfolioPreview from "../components/sections/PortfolioPreview";
import SignatureServices from "../components/sections/SignatureServices";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import WhyLoveUs from "../components/sections/WhyLoveUs";
import JsonLd from "../components/seo/JsonLd";
import { Button } from "../components/ui/button";
import { buildFaqJsonLd } from "../lib/jsonld";
import { getServerT } from "../lib/i18n-server";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Premium bridal makeup, skincare, and salon services in Mirpur-2, Dhaka. Book your Go & Glow appointment today.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const t = await getServerT();
  const faqItems = t("home.faq.items", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div>
      <JsonLd id="faq-jsonld" data={buildFaqJsonLd(faqItems)} />
      <Hero />
      <Stats />
      <SignatureServices />
      <MeetTeam />
      <WhyLoveUs />
      <Testimonials />
      <section className="mx-auto mt-16 max-w-5xl px-4 md:px-6">
        <div className="card-surface flex flex-col items-center justify-between gap-6 p-8 text-center md:flex-row md:text-left">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("home.offersCta.kicker")}</p>
            <h2 className="mt-3 font-serif text-3xl text-neutral-900 md:text-4xl">
              {t("home.offersCta.title")}
            </h2>
            <p className="mt-3 text-sm text-neutral-600 md:text-base">{t("home.offersCta.subtitle")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <a href="/offers">{t("home.offersCta.primary")}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/book">{t("home.offersCta.secondary")}</a>
            </Button>
          </div>
        </div>
      </section>
      <PortfolioPreview />
      <BlogPreview />
      <FAQ />
    </div>
  );
}
