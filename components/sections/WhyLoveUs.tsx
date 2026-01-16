"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function WhyLoveUs() {
  const { t } = useTranslation();
  const points = t("home.why.points", { returnObjects: true }) as string[];

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <h2 className="section-title">{t("home.why.title")}</h2>
          <p className="section-subtitle">{t("home.why.subtitle")}</p>
          <ul className="mt-6 space-y-3 text-sm text-neutral-600">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <span className="mt-1 text-peach-500">*</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="blob -left-16 -top-8" />
          <Image
            src="/images/why-love.png"
            alt={t("home.why.imageAlt")}
            width={520}
            height={520}
            className="w-full rounded-3xl object-cover shadow-card"
          />
        </div>
      </div>
    </section>
  );
}