import type { Metadata } from "next";

import ServicesPage from "../../components/pages/ServicesPage";

export const metadata: Metadata = {
  title: "Services",
  description: "Go & Glow এর ক্লাসিক ও ট্রেন্ডিং সেবা তালিকা।"
};

export default function Services() {
  return <ServicesPage />;
}