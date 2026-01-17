import type { Metadata } from "next";

import ContactPage from "../../components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Go & Glow for bookings, offers, and consultations.",
  alternates: {
    canonical: "/contact"
  }
};

export default function Contact() {
  return <ContactPage />;
}
