import { z } from "zod";

const phoneRegex = /^01[3-9]\d{8}$/;

export const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(phoneRegex, "Valid BD phone is required"),
  service: z.string().min(2, "Service is required"),
  date: z.string().min(1, "Preferred date is required"),
  time: z.string().min(1, "Preferred time is required"),
  message: z.string().optional(),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      fbclid: z.string().optional(),
      gclid: z.string().optional(),
      referrer: z.string().optional()
    })
    .optional()
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(phoneRegex, "Valid BD phone is required"),
  message: z.string().min(5, "Message is required"),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      fbclid: z.string().optional(),
      gclid: z.string().optional(),
      referrer: z.string().optional()
    })
    .optional()
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
