"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import BookingForm from "../sections/BookingForm";
import { useCalendar } from "../../lib/calendar-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function BookPage() {
  const { t } = useTranslation();
  const calendar = useCalendar();
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card" | "debit" | "bank" | "bkash">("bank");

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentStatus("idle");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/payments", { method: "POST", body: formData });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setPaymentStatus("success");
      form.reset();
    } catch {
      setPaymentStatus("error");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-peach-600">{t("booking.kicker")}</p>
          <h1 className="mt-4 font-serif text-4xl text-neutral-900 md:text-5xl">{t("booking.title")}</h1>
          <p className="mt-4 text-base text-neutral-600 md:text-lg">{t("booking.subtitle")}</p>
          <div className="mt-6 rounded-2xl bg-white/80 p-6 shadow-card">
            <p className="text-sm text-neutral-600">{t("booking.note")}</p>
            <p className="mt-3 text-xs text-neutral-500">{t("booking.integration")}</p>
          </div>
          <div className="mt-6 rounded-2xl bg-white/80 p-6 shadow-card">
            <p className="text-sm font-semibold text-neutral-800">{t("booking.calendarTitle")}</p>
            <div className="mt-3 space-y-2 text-sm text-neutral-600">
              {calendar.length === 0 && <p>{t("booking.calendarEmpty")}</p>}
              {calendar.map((entry) => (
                <div key={entry.date} className="flex items-center justify-between">
                  <span>{entry.date}</span>
                  <span className={entry.isFull ? "text-red-500" : "text-emerald-600"}>
                    {entry.isFull ? t("booking.fullBooked") : t("booking.available")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl bg-white/90 p-6 shadow-card">
            <BookingForm />
          </div>
          <div className="rounded-2xl bg-white/90 p-6 shadow-card">
            <h2 className="font-serif text-2xl text-neutral-900">{t("booking.paymentTitle")}</h2>
            <p className="mt-2 text-sm text-neutral-600">{t("booking.paymentSubtitle")}</p>
            <form className="mt-4 space-y-3" onSubmit={submitPayment}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input name="phone" placeholder={t("booking.payment.phone")} />
                <Input name="amount" placeholder={t("booking.payment.amount")} />
                <Input name="bookingId" placeholder={t("booking.payment.bookingId")} />
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-neutral-200 bg-white/80">
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-neutral-800">
                      <input
                        type="radio"
                        name="method"
                        value="wallet"
                        onChange={() => setPaymentMethod("wallet")}
                        className="h-4 w-4 accent-emerald-500"
                      />
                      <span>Wallet</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                        1% Partial Pay
                      </span>
                    </label>
                    <span className="text-xs text-neutral-500">Balance: 0 BDT</span>
                  </div>
                  <p className="border-t px-3 py-2 text-xs text-red-500">
                    You don&apos;t have enough funds to proceed with this payment. Please try another method.
                  </p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-neutral-800">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="method"
                        value="card"
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 accent-emerald-500"
                      />
                      Visa/Master Card
                    </span>
                    <span className="text-xs text-neutral-400">Visa/Master</span>
                  </label>
                </div>
                {paymentMethod === "card" && (
                  <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input name="cardHolder" placeholder="Card holder name" />
                      <Input name="cardLast4" placeholder="Card last 4 digits" />
                      <Input name="cardBank" placeholder="Card issuing bank" />
                      <Input name="transactionId" placeholder={t("booking.payment.transactionId")} />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      We only need the last 4 digits and transaction ID for verification.
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-neutral-800">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="method"
                        value="debit"
                        onChange={() => setPaymentMethod("debit")}
                        className="h-4 w-4 accent-emerald-500"
                      />
                      Debit Card
                    </span>
                    <span className="text-xs text-neutral-400">Debit</span>
                  </label>
                </div>
                {paymentMethod === "debit" && (
                  <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input name="debitHolder" placeholder="Card holder name" />
                      <Input name="debitLast4" placeholder="Card last 4 digits" />
                      <Input name="debitBank" placeholder="Issuing bank" />
                      <Input name="transactionId" placeholder={t("booking.payment.transactionId")} />
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">
                      No full card details needed. Provide the last 4 digits and transaction ID.
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/40">
                  <div className="flex items-center justify-between gap-3 px-3 py-2">
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-neutral-800">
                      <input
                        type="radio"
                        name="method"
                        value="bank"
                        defaultChecked
                        onChange={() => setPaymentMethod("bank")}
                        className="h-4 w-4 accent-emerald-500"
                      />
                      Bank Deposit
                    </label>
                    <span className="text-xs text-neutral-500">Bank account</span>
                  </div>
                  {paymentMethod === "bank" && (
                    <div className="space-y-3 border-t border-emerald-200 px-3 py-3">
                      <select
                        name="bank"
                        className="h-11 w-full rounded-xl border border-emerald-100 bg-white px-4 text-sm"
                        defaultValue="dbbl"
                      >
                        <option value="dbbl">DBBL</option>
                        <option value="city">The City Bank</option>
                        <option value="brac">BRAC Bank</option>
                      </select>
                      <div className="rounded-xl bg-white px-4 py-3 text-xs text-neutral-600 shadow-sm">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Account information</p>
                        <div className="mt-2 space-y-1">
                          <p>Account Name: Go &amp; Glow</p>
                          <p>Account Number: 0000000000000</p>
                          <p>Branch: Dhanmondi</p>
                        </div>
                      </div>
                      <div className="rounded-xl bg-white px-4 py-3 text-xs text-neutral-600 shadow-sm">
                        <div className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                          <span>Payable</span>
                          <span>Amount in BDT</span>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <Input name="transactionId" placeholder={t("booking.payment.transactionId")} />
                          <Input type="date" name="depositDate" />
                        </div>
                        <div className="mt-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-xs text-neutral-500">
                          <input
                            type="file"
                            name="slip"
                            className="w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-700"
                          />
                          <p className="mt-2">Drag &amp; drop image here or choose file</p>
                          <p className="text-[11px] text-neutral-400">Max 5 files, 20 MB each.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-2">
                  <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-neutral-800">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="method"
                        value="bkash"
                        onChange={() => setPaymentMethod("bkash")}
                        className="h-4 w-4 accent-emerald-500"
                      />
                      bKash
                    </span>
                    <span className="text-xs text-neutral-400">Mobile</span>
                  </label>
                </div>
                {paymentMethod === "bkash" && (
                  <div className="rounded-xl border border-neutral-200 bg-white/80 px-3 py-3">
                    <div className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                      Send payment to <span className="font-semibold text-neutral-800">bKash Merchant: 01XXXXXXXXX</span>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <Input name="bkashSender" placeholder="Sender bKash number" />
                      <Input name="transactionId" placeholder={t("booking.payment.transactionId")} />
                    </div>
                    <div className="mt-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-xs text-neutral-500">
                      <input
                        type="file"
                        name="slip"
                        className="w-full text-xs text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-emerald-700"
                      />
                      <p className="mt-2">Upload payment screenshot (optional)</p>
                      <p className="text-[11px] text-neutral-400">Max 5 files, 20 MB each.</p>
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full">
                {t("booking.payment.submit")}
              </Button>
              {paymentStatus === "success" && (
                <p className="text-sm text-emerald-600">{t("booking.payment.success")}</p>
              )}
              {paymentStatus === "error" && (
                <p className="text-sm text-red-600">{t("booking.payment.error")}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
