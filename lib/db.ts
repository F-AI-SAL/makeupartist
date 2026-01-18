import { sql } from "@vercel/postgres";

import type { BookingInput, ContactInput } from "./validation";

export function isDbEnabled() {
  return Boolean(process.env.POSTGRES_URL);
}

export async function ensureTables() {
  if (!isDbEnabled()) return;
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      phone text NOT NULL,
      service text NOT NULL,
      date text NOT NULL,
      time text NOT NULL,
      message text,
      utm jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      phone text NOT NULL,
      message text NOT NULL,
      utm jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

export async function insertBooking(requestId: string, data: BookingInput) {
  await ensureTables();
  await sql`
    INSERT INTO bookings (id, name, phone, service, date, time, message, utm)
    VALUES (${requestId}, ${data.name}, ${data.phone}, ${data.service}, ${data.date}, ${data.time}, ${
      data.message || null
    }, ${data.utm || null})
  `;
}

export async function insertContact(requestId: string, data: ContactInput) {
  await ensureTables();
  await sql`
    INSERT INTO contacts (id, name, phone, message, utm)
    VALUES (${requestId}, ${data.name}, ${data.phone}, ${data.message}, ${data.utm || null})
  `;
}
