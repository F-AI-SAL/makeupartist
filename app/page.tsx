import type { Metadata } from "next";

import BlogPreview from "../components/sections/BlogPreview";
import FAQ from "../components/sections/FAQ";
import Hero from "../components/sections/Hero";
import MeetTeam from "../components/sections/MeetTeam";
import PortfolioPreview from "../components/sections/PortfolioPreview";
import SignatureServices from "../components/sections/SignatureServices";
import Stats from "../components/sections/Stats";
import Testimonials from "../components/sections/Testimonials";
import WhyLoveUs from "../components/sections/WhyLoveUs";

export const metadata: Metadata = {
  title: "হোম",
  description: "Go & Glow এর আধুনিক, প্রিমিয়াম বিউটি পার্লারের হোমপেজ।"
};

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Stats />
      <SignatureServices />
      <MeetTeam />
      <WhyLoveUs />
      <Testimonials />
      <PortfolioPreview />
      <BlogPreview />
      <FAQ />
    </div>
  );
}