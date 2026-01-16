import bn from "../public/locales/bn/common.json";
import en from "../public/locales/en/common.json";

export const resources = {
  bn: { common: bn },
  en: { common: en }
} as const;

export type ResourceKey = keyof typeof resources;

