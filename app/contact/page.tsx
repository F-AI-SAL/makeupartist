import type { Metadata } from "next";

import ContactPage from "../../components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Go & Glow এর সাথে যোগাযোগ করুন।"
};

export default function Contact() {
  return <ContactPage />;
}