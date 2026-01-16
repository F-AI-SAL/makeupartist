"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

export default function PortfolioPreview() {
  const { t } = useTranslation();
  const items = t("home.portfolio.items", { returnObjects: true }) as Array<{
    title: string;
    image: string;
  }>;

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="section-title">{t("home.portfolio.title")}</h2>
          <p className="section-subtitle">{t("home.portfolio.subtitle")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/portfolio">{t("home.portfolio.cta")}</Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl bg-white/80 p-4 shadow-card">
            <Image
              src={item.image}
              alt={item.title}
              width={360}
              height={360}
              className="h-56 w-full rounded-xl object-cover"
            />
            <p className="mt-3 text-sm font-semibold text-neutral-800">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

