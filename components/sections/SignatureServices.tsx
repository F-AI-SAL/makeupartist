"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function SignatureServices() {
  const { t } = useTranslation();
  const services = t("home.signatureServices.items", { returnObjects: true }) as Array<{
    title: string;
    description: string;
    image: string;
  }>;

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4 md:px-6">
      <div className="text-center">
        <h2 className="section-title">{t("home.signatureServices.title")}</h2>
        <p className="section-subtitle">{t("home.signatureServices.subtitle")}</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title}>
            <CardHeader>
              <CardTitle>{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Image
                src={service.image}
                alt={service.title}
                width={360}
                height={240}
                className="h-40 w-full rounded-xl object-cover"
              />
              <p className="text-sm text-neutral-600">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

