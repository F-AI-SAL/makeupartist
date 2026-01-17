"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ContactForm from "../sections/ContactForm";
import { siteConfigClient } from "../../lib/site-client";

export default function ContactPage() {
  const { t } = useTranslation();
  const [site, setSite] = useState(siteConfigClient);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/site");
      if (!response.ok) return;
      const json = await response.json();
      if (json?.data) {
        setSite(json.data);
      }
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("contact.kicker")}</p>
        <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("contact.subtitle")}</p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/80 p-6 shadow-card">
            <p className="text-sm font-semibold text-neutral-800">{t("contact.info.title")}</p>
            <p className="mt-2 text-sm text-neutral-600">{site.address}</p>
            <p className="mt-2 text-sm text-neutral-600">{t("contact.info.phone", { phone: site.phone })}</p>
            <p className="mt-2 text-sm text-neutral-500">{t("contact.info.hours")}</p>
          </div>
          <div className="rounded-2xl bg-white/80 p-6 shadow-card">
            <p className="text-sm font-semibold text-neutral-800">{t("contact.mapTitle")}</p>
            <div className="mt-4 flex h-56 items-center justify-center rounded-2xl border border-dashed border-peach-200 text-sm text-neutral-400">
              {t("contact.mapPlaceholder")}
            </div>
            <p className="mt-4 text-xs text-neutral-500">{t("contact.spamNote")}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/90 p-6 shadow-card">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

