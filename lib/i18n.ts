"use client";

import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./translations";

let instance: i18n | null = null;

export function initI18n(): i18n {
  if (instance) {
    return instance;
  }

  instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources,
    lng: "bn",
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });

  return instance;
}

