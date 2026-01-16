"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function ServicesPage() {
  const { t } = useTranslation();
  const classic = t("services.classic.items", { returnObjects: true }) as string[];
  const trending = t("services.trending.items", { returnObjects: true }) as string[];
  const [liveServices, setLiveServices] = useState<Array<any>>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/services");
      const data = await response.json();
      setLiveServices(data?.data || []);
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("services.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("services.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("services.subtitle")}</p>
      </div>

      {liveServices.length > 0 && (
        <div className="mt-12">
          <h2 className="section-title">{t("services.liveTitle")}</h2>
          <p className="section-subtitle">{t("services.liveSubtitle")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {liveServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <p className="text-sm text-peach-600">{service.price}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("services.classic.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-neutral-600">
              {classic.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-peach-500">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("services.trending.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-neutral-600">
              {trending.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-peach-500">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
