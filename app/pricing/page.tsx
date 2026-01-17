import type { Metadata } from "next";

import PricingPage from "../../components/pages/PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent starting prices for Go & Glow packages and services.",
  alternates: {
    canonical: "/pricing"
  }
};

export default function Pricing() {
  return <PricingPage />;
}
