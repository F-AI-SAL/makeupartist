const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { z } = require("zod");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const phoneRegex = /^01[3-9]\d{8}$/;

const bookingSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  service: z.string().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
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

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  message: z.string().min(5),
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

async function ensureTables() {
  await pool.query(`
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
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contacts (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      phone text NOT NULL,
      message text NOT NULL,
      utm jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/booking", async (req, res) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid booking payload" });
  }
  await ensureTables();
  const id = crypto.randomUUID();
  const utm = parsed.data.utm ? JSON.stringify(parsed.data.utm) : null;
  await pool.query(
    `INSERT INTO bookings (id, name, phone, service, date, time, message, utm)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)` ,
    [
      id,
      parsed.data.name,
      parsed.data.phone,
      parsed.data.service,
      parsed.data.date,
      parsed.data.time,
      parsed.data.message || null,
      utm
    ]
  );
  res.json({ ok: true, data: { id } });
});

app.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, error: "Invalid contact payload" });
  }
  await ensureTables();
  const id = crypto.randomUUID();
  const utm = parsed.data.utm ? JSON.stringify(parsed.data.utm) : null;
  await pool.query(
    `INSERT INTO contacts (id, name, phone, message, utm)
     VALUES ($1, $2, $3, $4, $5::jsonb)` ,
    [id, parsed.data.name, parsed.data.phone, parsed.data.message, utm]
  );
  res.json({ ok: true, data: { id } });
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Booking service running on ${port}`);
});
