import { cookies } from "next/headers";
import i18next from "i18next";

import { resources } from "./translations";

export async function getServerT() {
  const langCookie = cookies().get("lang")?.value;
  const language = langCookie === "en" ? "en" : "bn";
  const instance = i18next.createInstance();

  await instance.init({
    resources,
    lng: language,
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });

  return instance.t.bind(instance);
}

