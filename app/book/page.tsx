import type { Metadata } from "next";

import BookPage from "../../components/pages/BookPage";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book your Go & Glow appointment in Mirpur-2, Dhaka.",
  alternates: {
    canonical: "/book"
  }
};

export default function Book() {
  return <BookPage />;
}
