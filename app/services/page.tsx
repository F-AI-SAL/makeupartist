import type { Metadata } from "next";

import ServicesPage from "../../components/pages/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore classic and trending beauty services tailored for Dhaka clients.",
  alternates: {
    canonical: "/services"
  }
};

export default function Services() {
  return <ServicesPage />;
}
