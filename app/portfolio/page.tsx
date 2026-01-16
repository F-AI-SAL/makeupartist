import type { Metadata } from "next";

import PortfolioPage from "../../components/pages/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Go & Glow এর রিয়েল ক্লায়েন্ট ট্রান্সফর্মেশনস।"
};

export default function Portfolio() {
  return <PortfolioPage />;
}