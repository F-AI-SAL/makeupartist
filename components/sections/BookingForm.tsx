"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { bookingSchema, type BookingInput } from "../../lib/validation";
import { readUtmFromStorage } from "../../lib/utm";
import { trackPixel } from "../../lib/pixel";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function BookingForm() {
  const { t } = useTranslation();
  const services = t("booking.services", { returnObjects: true }) as string[];
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (values: BookingInput) => {
    setStatus("idle");
    try {
      const utm = readUtmFromStorage();
      const payload = utm ? { ...values, utm } : values;
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setStatus("success");
      trackPixel("Lead", { source: "booking", ...utm });
      trackPixel("CompleteRegistration", { source: "booking", ...utm });
      reset();
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("booking.form.name")}</Label>
          <Input id="name" {...register("name")} placeholder={t("booking.form.namePlaceholder")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("booking.form.phone")}</Label>
          <Input id="phone" {...register("phone")} placeholder={t("booking.form.phonePlaceholder")} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="service">{t("booking.form.service")}</Label>
        <select
          id="service"
          {...register("service")}
          className="h-11 w-full rounded-xl border border-peach-100 bg-white/80 px-4 text-sm"
        >
          <option value="">{t("booking.form.servicePlaceholder")}</option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        {errors.service && <p className="text-xs text-red-500">{errors.service.message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">{t("booking.form.date")}</Label>
          <Input id="date" type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">{t("booking.form.time")}</Label>
          <Input id="time" type="time" {...register("time")} />
          {errors.time && <p className="text-xs text-red-500">{errors.time.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">{t("booking.form.message")}</Label>
        <Textarea id="message" {...register("message")} placeholder={t("booking.form.messagePlaceholder")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("booking.form.submitting") : t("booking.form.submit")}
      </Button>
      {status === "success" && (
        <p className="text-sm text-emerald-600">{t("booking.form.success")}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">{t("booking.form.error")}</p>
      )}
    </form>
  );
}

