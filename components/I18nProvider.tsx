"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { I18nextProvider } from "react-i18next";

import { initI18n } from "../lib/i18n";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = useMemo(() => initI18n(), []);

  useEffect(() => {
    const storedLang = window.localStorage.getItem("lang");
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}