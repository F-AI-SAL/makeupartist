import type { Metadata } from "next";

import AboutPage from "../../components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the Go & Glow team and learn about our beauty philosophy.",
  alternates: {
    canonical: "/about"
  }
};

export default function About() {
  return <AboutPage />;
}
