"use client";

import { useTranslation } from "react-i18next";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export default function FAQ() {
  const { t } = useTranslation();
  const items = t("home.faq.items", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <section className="mx-auto mt-20 max-w-4xl px-4 md:px-6">
      <div className="text-center">
        <h2 className="section-title">{t("home.faq.title")}</h2>
        <p className="section-subtitle">{t("home.faq.subtitle")}</p>
      </div>
      <Accordion type="single" collapsible className="mt-8 space-y-3">
        {items.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

