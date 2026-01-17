import type { MetadataRoute } from "next";

import { siteConfig } from "../lib/site";
import { getOffers } from "../lib/offers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/portfolio",
    "/book",
    "/blog",
    "/offers",
    "/contact"
  ];
  const offers = await getOffers();
  const offerRoutes = offers.map((offer) => `/offer/${offer.slug}`);

  return [...routes, ...offerRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}

