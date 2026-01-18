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

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  utm jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
