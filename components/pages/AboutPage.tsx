"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

export default function AboutPage() {
  const { t } = useTranslation();
  const values = t("about.values.items", { returnObjects: true }) as string[];
  const [team, setTeam] = useState<Array<any>>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/team");
      const data = await response.json();
      setTeam(data?.data || []);
    };
    void load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("about.hero.kicker")}</p>
          <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("about.hero.title")}</h1>
          <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("about.hero.subtitle")}</p>
          <Button asChild className="mt-6">
            <a href="/book">{t("about.hero.cta")}</a>
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="arched-frame w-[280px] md:w-[360px]">
            <Image
              src="/images/about-hero.png"
              alt={t("about.hero.imageAlt")}
              width={520}
              height={640}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </div>

      <div className="mt-16 grid gap-6 rounded-2xl bg-white/80 p-8 shadow-card md:grid-cols-2">
        <div>
          <h2 className="section-title">{t("about.story.title")}</h2>
          <p className="mt-4 text-sm text-neutral-600">{t("about.story.body")}</p>
        </div>
        <div>
          <h3 className="font-serif text-2xl text-neutral-900">{t("about.values.title")}</h3>
          <ul className="mt-4 space-y-3 text-sm text-neutral-600">
            {values.map((value) => (
              <li key={value} className="flex items-start gap-2">
                <span className="text-peach-500">*</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {team.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title">{t("about.teamTitle")}</h2>
          <p className="section-subtitle">{t("about.teamSubtitle")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {team.map((member) => (
              <div key={member.id} className="rounded-2xl bg-white/80 p-4 shadow-card">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={320}
                  height={320}
                  className="h-48 w-full rounded-xl object-cover"
                />
                <p className="mt-3 font-semibold text-neutral-800">{member.name}</p>
                <p className="text-sm text-neutral-500">{member.role}</p>
                <p className="mt-2 text-sm text-neutral-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
