"use client";

import { useTranslation } from "react-i18next";

export default function Stats() {
  const { t } = useTranslation();
  const stats = t("home.stats", { returnObjects: true }) as Array<{ label: string; value: string }>;

  return (
    <section className="mx-auto -mt-6 max-w-6xl px-4 md:px-6">
      <div className="grid gap-4 rounded-2xl bg-white/80 px-6 py-6 shadow-card md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-serif text-2xl text-neutral-900 md:text-3xl">{stat.value}</p>
            <p className="text-sm text-neutral-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

