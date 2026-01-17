"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { contactSchema, type ContactInput } from "../../lib/validation";
import { readUtmFromStorage } from "../../lib/utm";
import { trackPixel } from "../../lib/pixel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function ContactForm() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus("idle");
    try {
      const utm = readUtmFromStorage();
      const payload = utm ? { ...values, utm } : values;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setStatus("success");
      trackPixel("Lead", { source: "contact", ...utm });
      reset();
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("contact.form.name")}</Label>
          <Input id="name" {...register("name")} placeholder={t("contact.form.namePlaceholder")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("contact.form.phone")}</Label>
          <Input id="phone" {...register("phone")} placeholder={t("contact.form.phonePlaceholder")} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("contact.form.message")}</Label>
        <Textarea id="message" {...register("message")} placeholder={t("contact.form.messagePlaceholder")} />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
      </Button>
      {status === "success" && (
        <p className="text-sm text-emerald-600">{t("contact.form.success")}</p>
      )}
      {status === "error" && <p className="text-sm text-red-600">{t("contact.form.error")}</p>}
    </form>
  );
}

