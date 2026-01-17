import type { OfferWithStatus } from "./offers";
import type { ServiceItem } from "./services-data";
import type { SiteConfig } from "./site";

export function buildLocalBusinessJsonLd(site: SiteConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka",
      addressCountry: "BD",
      streetAddress: site.address
    },
    areaServed: "Dhaka",
    priceRange: "$$"
  };
}

export function buildServiceJsonLd(site: SiteConfig, services: ServiceItem[]) {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description || "",
    provider: {
      "@type": "BeautySalon",
      name: site.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address,
        addressLocality: "Dhaka",
        addressCountry: "BD"
      }
    }
  }));
}

export function buildFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function buildOfferJsonLd(site: SiteConfig, offer: OfferWithStatus) {
  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: offer.title,
    description: offer.description,
    price: offer.discount,
    priceCurrency: "BDT",
    availability: offer.isActive ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    validFrom: offer.startDate,
    validThrough: offer.endDate,
    url: `${site.url}/offer/${offer.slug}`,
    seller: {
      "@type": "BeautySalon",
      name: site.name
    }
  };
}
