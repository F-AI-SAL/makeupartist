import type { Metadata } from "next";

import AboutPage from "../../components/pages/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description: "Go & Glow এর গল্প, টিম এবং ভ্যালু।"
};

export default function About() {
  return <AboutPage />;
}