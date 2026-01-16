import type { Metadata } from "next";

import PricingPage from "../../components/pages/PricingPage";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Go & Glow এর প্রাইসিং টিয়ারসমূহ।"
};

export default function Pricing() {
  return <PricingPage />;
}