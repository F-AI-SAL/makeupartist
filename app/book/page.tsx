import type { Metadata } from "next";

import BookPage from "../../components/pages/BookPage";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Go & Glow এর জন্য অ্যাপয়েন্টমেন্ট বুক করুন।"
};

export default function Book() {
  return <BookPage />;
}