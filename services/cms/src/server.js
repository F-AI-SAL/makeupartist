const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_PASSWORD_ENABLED = Boolean(ADMIN_PASSWORD);

const collections = new Set(["services", "offers", "team", "media"]);
const singletons = new Set(["menu", "site"]);

function assertCollection(table) {
  if (!collections.has(table)) throw new Error("Invalid collection table");
}

function assertSingleton(table) {
  if (!singletons.has(table)) throw new Error("Invalid singleton table");
}

async function ensureTables() {
  await pool.query(`CREATE TABLE IF NOT EXISTS services (id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS offers (id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS team (id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS media (id text PRIMARY KEY, payload jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS menu (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());`);
  await pool.query(`CREATE TABLE IF NOT EXISTS site (id text PRIMARY KEY, payload jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());`);
}

function requireAdmin(req, res, next) {
  const password = req.header("x-admin-password");
  if (!ADMIN_PASSWORD_ENABLED || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/:collection(services|offers|team|media)", async (req, res) => {
  await ensureTables();
  const table = req.params.collection;
  assertCollection(table);
  const rows = await pool.query(`SELECT payload FROM ${table} ORDER BY created_at ASC;`);
  res.json({ ok: true, data: rows.rows.map((row) => row.payload) });
});

app.post("/admin/:collection(services|offers|team|media)", requireAdmin, async (req, res) => {
  await ensureTables();
  const table = req.params.collection;
  assertCollection(table);
  const payload = JSON.stringify(req.body);
  await pool.query(
    `INSERT INTO ${table} (id, payload)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload;`,
    [req.body.id, payload]
  );
  res.json({ ok: true, data: req.body });
});

app.put("/admin/:collection(services|offers|team|media)", requireAdmin, async (req, res) => {
  await ensureTables();
  const table = req.params.collection;
  assertCollection(table);
  const payload = JSON.stringify(req.body);
  await pool.query(
    `INSERT INTO ${table} (id, payload)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload;`,
    [req.body.id, payload]
  );
  res.json({ ok: true, data: req.body });
});

app.delete("/admin/:collection(services|offers|team|media)", requireAdmin, async (req, res) => {
  await ensureTables();
  const table = req.params.collection;
  assertCollection(table);
  const id = req.query.id;
  await pool.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
  res.json({ ok: true, data: { id } });
});

app.get("/:singleton(menu|site)", async (req, res) => {
  await ensureTables();
  const table = req.params.singleton;
  assertSingleton(table);
  const rows = await pool.query(`SELECT payload FROM ${table} WHERE id = 'default' LIMIT 1;`);
  res.json({ ok: true, data: rows.rows[0]?.payload || null });
});

app.post("/admin/:singleton(menu|site)", requireAdmin, async (req, res) => {
  await ensureTables();
  const table = req.params.singleton;
  assertSingleton(table);
  const payload = JSON.stringify(req.body);
  await pool.query(
    `INSERT INTO ${table} (id, payload, updated_at)
     VALUES ('default', $1::jsonb, now())
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload, updated_at = now();`,
    [payload]
  );
  res.json({ ok: true, data: req.body });
});

const port = process.env.PORT || 4002;
app.listen(port, () => {
  console.log(`CMS service running on ${port}`);
});
