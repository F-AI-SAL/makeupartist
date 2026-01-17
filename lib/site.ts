import { dataPath, readJson } from "./storage";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  phone: string;
  address: string;
  pixelId?: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
};

const SITE_PATH = dataPath("site.json");

export const defaultSiteConfig: SiteConfig = {
  name: "Go & Glow",
  description:
    "Go & Glow is a premium beauty parlor in Mirpur-2, Dhaka offering bridal makeup, skincare, hair styling, and glow-focused treatments with a modern, elegant touch.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  phone: "01929041115",
  address: "Mirpur-2, Dhaka",
  socials: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    tiktok: "https://tiktok.com/",
    whatsapp: "https://wa.me/01929041115"
  }
};

export const siteConfig = defaultSiteConfig;

export async function getSiteConfig(): Promise<SiteConfig> {
  return await readJson(SITE_PATH, defaultSiteConfig);
}
