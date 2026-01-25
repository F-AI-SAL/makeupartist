import { sql } from "@vercel/postgres";

import { isDbEnabled } from "./db";

const COLLECTION_TABLES = ["services", "offers", "team", "media"] as const;
const SINGLETON_TABLES = ["menu", "site"] as const;

async function ensureCollectionTable(table: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([table])} (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

async function ensureSingletonTable(table: string) {
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier([table])} (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `;
}

export async function ensureAdminTables() {
  if (!isDbEnabled()) return;
  for (const table of COLLECTION_TABLES) {
    await ensureCollectionTable(table);
  }
  for (const table of SINGLETON_TABLES) {
    await ensureSingletonTable(table);
  }
}

export async function getCollection(table: string) {
  await ensureAdminTables();
  const rows = await sql`
    SELECT payload
    FROM ${sql.identifier([table])}
    ORDER BY created_at ASC;
  `;
  return rows.rows.map((row) => row.payload);
}

export async function upsertItem(table: string, item: Record<string, unknown>) {
  await ensureAdminTables();
  const payload = JSON.stringify(item);
  await sql`
    INSERT INTO ${sql.identifier([table])} (id, payload)
    VALUES (${item.id as string}, ${payload}::jsonb)
    ON CONFLICT (id)
    DO UPDATE SET payload = EXCLUDED.payload;
  `;
}

export async function deleteItem(table: string, id: string) {
  await ensureAdminTables();
  await sql`
    DELETE FROM ${sql.identifier([table])}
    WHERE id = ${id};
  `;
}

export async function getSingleton<T>(table: string, fallback: T): Promise<T> {
  await ensureAdminTables();
  const rows = await sql`
    SELECT payload
    FROM ${sql.identifier([table])}
    WHERE id = 'default'
    LIMIT 1;
  `;
  if (!rows.rows[0]?.payload) {
    return fallback;
  }
  return rows.rows[0].payload as T;
}

export async function setSingleton(table: string, payload: Record<string, unknown>) {
  await ensureAdminTables();
  const data = JSON.stringify(payload);
  await sql`
    INSERT INTO ${sql.identifier([table])} (id, payload, updated_at)
    VALUES ('default', ${data}::jsonb, now())
    ON CONFLICT (id)
    DO UPDATE SET payload = EXCLUDED.payload, updated_at = now();
  `;
}
