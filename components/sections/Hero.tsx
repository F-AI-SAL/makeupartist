"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute left-6 top-10 h-20 w-20 rounded-full border border-peach-200/60" />
      <div className="absolute right-20 top-24 h-3 w-3 rounded-full bg-peach-300" />
      <div className="absolute right-10 top-40 h-6 w-6 rounded-full border border-peach-300" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.2em] text-peach-600">
            {t("home.hero.kicker")}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-neutral-900 md:text-5xl">
            {t("home.hero.title")}
          </h1>
          <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("home.hero.subtitle")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/book">{t("home.hero.ctaPrimary")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/services">{t("home.hero.ctaSecondary")}</Link>
            </Button>
          </div>
          <div className="mt-6 flex items-center gap-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-soft">
              * {t("home.hero.badge")}
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative flex justify-center"
        >
          <div className="blob -left-16 -top-6" />
          <div className="blob -bottom-10 right-4" />
          <div className="arched-frame w-[280px] md:w-[360px]">
            <Image
              src="/images/hero.png"
              alt={t("home.hero.imageAlt")}
              width={520}
              height={640}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}