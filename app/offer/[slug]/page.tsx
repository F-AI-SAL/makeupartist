import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "../../../components/seo/JsonLd";
import { Button } from "../../../components/ui/button";
import { getOffers, getOfferBySlug } from "../../../lib/offers";
import { buildOfferJsonLd } from "../../../lib/jsonld";
import { getServerT } from "../../../lib/i18n-server";
import { siteConfig } from "../../../lib/site";

export async function generateStaticParams() {
  const offers = await getOffers();
  return offers.map((offer) => ({ slug: offer.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offer = await getOfferBySlug(params.slug);
  if (!offer) {
    return {};
  }
  return {
    title: offer.title,
    description: offer.description,
    alternates: {
      canonical: `/offer/${offer.slug}`
    },
    openGraph: {
      title: offer.title,
      description: offer.description,
      url: `${siteConfig.url}/offer/${offer.slug}`
    }
  };
}

export default async function OfferPage({ params }: { params: { slug: string } }) {
  const offer = await getOfferBySlug(params.slug);
  if (!offer) {
    notFound();
  }
  const t = await getServerT();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <JsonLd id={`offer-jsonld-${offer.slug}`} data={buildOfferJsonLd(offer)} />
      <div className="card-surface p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("offers.kicker")}</p>
            <h1 className="mt-3 font-serif text-4xl text-neutral-900 md:text-5xl">{offer.title}</h1>
            <p className="mt-4 text-base text-neutral-600 md:text-lg">{offer.description}</p>
          </div>
          <span className="rounded-full bg-peach-50 px-4 py-2 text-sm font-semibold text-peach-600">
            {offer.discount}
          </span>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
          <span>
            {t("offers.validity")} {offer.startDate} - {offer.endDate}
          </span>
          {offer.isActive && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              {t("offers.active")}
            </span>
          )}
          {offer.isUpcoming && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
              {t("offers.upcoming")}
            </span>
          )}
          {offer.isExpired && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-600">
              {t("offers.expired")}
            </span>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <a href="/book">{t("offers.bookNow")}</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/offers">{t("offers.backToOffers")}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
