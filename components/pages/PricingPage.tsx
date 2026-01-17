"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import ServiceMenu from "../sections/ServiceMenu";

export default function PricingPage() {
  const { t } = useTranslation();
  const tiers = t("pricing.tiers", { returnObjects: true }) as Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
    highlight?: boolean;
  }>;
  const menu = t("services.menu", { returnObjects: true }) as Array<any>;
  const [offers, setOffers] = useState<Array<any>>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/offers");
      const data = await response.json();
      setOffers(data?.data || []);
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("pricing.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("pricing.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("pricing.subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name} className={tier.highlight ? "border-2 border-peach-300" : ""}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <p className="mt-2 text-2xl font-semibold text-peach-600">{tier.price}</p>
              <p className="text-sm text-neutral-600">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-neutral-600">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-peach-500">-</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full">
                <a href="/book">{t("pricing.cta")}</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="section-title">{t("pricing.priceListTitle")}</h2>
        <p className="section-subtitle">{t("pricing.priceListSubtitle")}</p>
        <ServiceMenu sections={menu} viewAllLabel={t("services.viewAll")} />
      </div>

      {offers.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title">{t("pricing.offersTitle")}</h2>
          <p className="section-subtitle">{t("pricing.offersSubtitle")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <CardTitle>{offer.title}</CardTitle>
                  <p className="text-sm text-peach-600">{offer.discount}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">{offer.description}</p>
                  <p className="mt-2 text-xs text-neutral-500">
                    {offer.startDate} - {offer.endDate}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
