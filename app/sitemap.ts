import type { MetadataRoute } from "next";

import { siteConfig } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/portfolio",
    "/book",
    "/blog",
    "/contact"
  ];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}

