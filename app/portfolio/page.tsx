import type { Metadata } from "next";

import PortfolioPage from "../../components/pages/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse bridal and party makeup transformations from Go & Glow.",
  alternates: {
    canonical: "/portfolio"
  }
};

export default function Portfolio() {
  return <PortfolioPage />;
}
