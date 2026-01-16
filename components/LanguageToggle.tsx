"use client";

import { useTranslation } from "react-i18next";

import { Button } from "./ui/button";

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const current = i18n.language || "bn";

  const toggleLanguage = () => {
    const next = current === "bn" ? "en" : "bn";
    i18n.changeLanguage(next);
    window.localStorage.setItem("lang", next);
    document.cookie = `lang=${next}; path=/; max-age=31536000`;
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      aria-label={t("languageToggle.label")}
    >
      {current === "bn" ? t("languageToggle.toEn") : t("languageToggle.toBn")}
    </Button>
  );
}

