"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { siteConfig } from "../../lib/site";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function Footer() {
  const { t } = useTranslation();
  const [site, setSite] = useState(siteConfig);
  const links = t("footer.links", { returnObjects: true }) as Array<{ label: string; href: string }>;
  const hours = t("footer.hours", { returnObjects: true }) as string[];
  const socials = useMemo(
    () =>
      [
        { label: "Facebook", href: site.socials?.facebook },
        { label: "Instagram", href: site.socials?.instagram },
        { label: "YouTube", href: site.socials?.youtube },
        { label: "TikTok", href: site.socials?.tiktok },
        { label: "WhatsApp", href: site.socials?.whatsapp }
      ].filter((item) => item.href),
    [site.socials]
  );

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
    <footer className="mt-20 bg-neutral-900 text-neutral-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="space-y-4">
          <p className="font-serif text-xl">{site.name}</p>
          <p className="text-sm text-neutral-300">{t("footer.tagline")}</p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-200">{t("footer.quickLinks")}</p>
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-neutral-300 hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-200">{t("footer.visit")}</p>
          <p className="text-sm text-neutral-300">{site.address}</p>
          <p className="text-sm text-neutral-300">{t("footer.phone", { phone: site.phone })}</p>
          <div className="text-sm text-neutral-300">
            {hours.map((hour) => (
              <p key={hour}>{hour}</p>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-neutral-200">{t("footer.newsletter")}</p>
          <p className="text-sm text-neutral-300">{t("footer.newsletterCopy")}</p>
          <div className="flex gap-2">
            <Input aria-label={t("footer.emailPlaceholder")} placeholder={t("footer.emailPlaceholder")} />
            <Button size="sm">{t("footer.subscribe")}</Button>
          </div>
          {socials.length > 0 ? (
            <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="hover:text-neutral-200"
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-400">{t("footer.social")}</p>
          )}
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        {t("footer.copy", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}

