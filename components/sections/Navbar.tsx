"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import { Button } from "../ui/button";
import LanguageToggle from "../LanguageToggle";
import { siteConfig } from "../../lib/site";

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const navItems = t("nav.items", { returnObjects: true }) as Array<{ label: string; href: string }>;

  return (
    <header className="sticky top-0 z-40 border-b border-peach-100/60 bg-white/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="font-serif text-xl text-neutral-900">
          {siteConfig.name}
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-neutral-700 hover:text-peach-600">
              {item.label}
            </Link>
          ))}
          <LanguageToggle />
          <Button asChild>
            <Link href="/book">{t("nav.cta")}</Link>
          </Button>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-full border border-peach-200 px-4 py-2 text-sm"
            aria-label={t("nav.menu")}
          >
            {t("nav.menu")}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-peach-100 bg-white/90 px-4 pb-4 md:hidden"
          >
            <div className="flex flex-col gap-3 pt-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm">
                  {item.label}
                </Link>
              ))}
              <Button asChild>
                <Link href="/book">{t("nav.cta")}</Link>
              </Button>
              <p className="text-xs text-neutral-500">{t("nav.phone", { phone: siteConfig.phone })}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

