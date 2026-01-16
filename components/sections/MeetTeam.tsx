"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

export default function MeetTeam() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="arched-frame w-[260px] md:w-[360px]">
            <Image
              src="/images/about-artist.png"
              alt={t("home.meet.imageAlt")}
              width={520}
              height={640}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="section-title">{t("home.meet.title")}</h2>
          <p className="section-subtitle">{t("home.meet.subtitle")}</p>
          <p className="mt-4 text-sm text-neutral-600">{t("home.meet.body")}</p>
          <Button asChild className="mt-6">
            <a href="/about">{t("home.meet.cta")}</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

