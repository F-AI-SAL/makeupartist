import type { Metadata } from "next";
import Link from "next/link";

import { getServerT } from "../../lib/i18n-server";
import { getOffers } from "../../lib/offers";
import { siteConfig } from "../../lib/site";

export const metadata: Metadata = {
  title: "Offers",
  description: "Weekly beauty deals and limited-time offers from Go & Glow.",
  alternates: {
    canonical: "/offers"
  },
  openGraph: {
    title: "Offers",
    description: "Weekly beauty deals and limited-time offers from Go & Glow.",
    url: `${siteConfig.url}/offers`
  }
};

export default async function OffersPage() {
  const t = await getServerT();
  const offers = await getOffers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("offers.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("offers.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("offers.subtitle")}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {offers.map((offer) => (
          <div key={offer.id} className="card-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl text-neutral-900">{offer.title}</h2>
                <p className="mt-2 text-sm text-neutral-600">{offer.description}</p>
              </div>
              <span className="rounded-full bg-peach-50 px-3 py-1 text-xs font-semibold text-peach-600">
                {offer.discount}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
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
            <Link
              className="mt-5 inline-flex text-sm font-semibold text-peach-600"
              href={`/offer/${offer.slug}`}
            >
              {t("offers.viewDetails")}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
