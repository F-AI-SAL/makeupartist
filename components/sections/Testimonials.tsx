"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
  const { t } = useTranslation();
  const testimonials = t("home.testimonials.items", { returnObjects: true }) as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [testimonials.length]);

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 md:px-6">
      <div className="text-center">
        <h2 className="section-title">{t("home.testimonials.title")}</h2>
        <p className="section-subtitle">{t("home.testimonials.subtitle")}</p>
      </div>
      <div className="mt-8 rounded-2xl bg-white/80 p-8 shadow-card">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="text-center text-lg text-neutral-700"
          >
            &ldquo;{testimonials[index]}&rdquo;
          </motion.blockquote>
        </AnimatePresence>
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`h-2 w-6 rounded-full ${
                idx === index ? "bg-peach-500" : "bg-peach-200"
              }`}
              aria-label={t("home.testimonials.dot", { index: idx + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
