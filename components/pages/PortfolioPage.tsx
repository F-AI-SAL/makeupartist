"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function PortfolioPage() {
  const { t } = useTranslation();
  const items = t("portfolio.items", { returnObjects: true }) as Array<{
    title: string;
    image: string;
  }>;
  const [media, setMedia] = useState<Array<any>>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/media");
      const data = await response.json();
      setMedia(data?.data || []);
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("portfolio.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("portfolio.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("portfolio.subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
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

      <div className="mt-16">
        <h2 className="section-title">{t("portfolio.mediaTitle")}</h2>
        <p className="section-subtitle">{t("portfolio.mediaSubtitle")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {media.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white/80 p-4 shadow-card">
              {item.type === "video" ? (
                <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-100">
                  <iframe
                    src={item.url}
                    title={item.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.title}
                  width={360}
                  height={240}
                  className="h-48 w-full rounded-xl object-cover"
                />
              )}
              <p className="mt-3 text-sm font-semibold text-neutral-800">{item.title}</p>
              <p className="text-xs text-neutral-500">{item.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
