import type { OfferWithStatus } from "./offers";
import type { ServiceItem } from "./services-data";
import { siteConfig } from "./site";

export function buildLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka",
      addressCountry: "BD",
      streetAddress: siteConfig.address
    },
    areaServed: "Dhaka",
    priceRange: "$$"
  };
}

export function buildServiceJsonLd(services: ServiceItem[]) {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description || "",
    provider: {
      "@type": "BeautySalon",
      name: siteConfig.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address,
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

export function buildOfferJsonLd(offer: OfferWithStatus) {
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
    url: `${siteConfig.url}/offer/${offer.slug}`,
    seller: {
      "@type": "BeautySalon",
      name: siteConfig.name
    }
  };
}
