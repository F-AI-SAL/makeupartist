import fs from "node:fs/promises";
import path from "node:path";

import { slugify } from "./slug";

export type OfferRecord = {
  id: string;
  title: string;
  description: string;
  discount: string;
  startDate: string;
  endDate: string;
};

export type OfferWithStatus = OfferRecord & {
  slug: string;
  isActive: boolean;
  isUpcoming: boolean;
  isExpired: boolean;
};

const OFFERS_PATH = path.join(process.cwd(), "data", "offers.json");

function toDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStatus(offer: OfferRecord) {
  const now = new Date();
  const start = toDate(offer.startDate);
  const end = toDate(offer.endDate);
  if (!start || !end) {
    return { isActive: false, isUpcoming: false, isExpired: false };
  }
  const isActive = now >= start && now <= end;
  const isUpcoming = now < start;
  const isExpired = now > end;
  return { isActive, isUpcoming, isExpired };
}

export async function getOffers(): Promise<OfferWithStatus[]> {
  const raw = await fs.readFile(OFFERS_PATH, "utf8").catch(() => "[]");
  const offers = JSON.parse(raw) as OfferRecord[];
  return offers.map((offer) => ({
    ...offer,
    slug: slugify(offer.title),
    ...getStatus(offer)
  }));
}

export async function getOfferBySlug(slug: string) {
  const offers = await getOffers();
  return offers.find((offer) => offer.slug === slug);
}
