import { sql } from "@vercel/postgres";

import { isDbEnabled } from "./db";

const COLLECTION_TABLES = ["services", "offers", "team", "media"] as const;
const SINGLETON_TABLES = ["menu", "site"] as const;

type CollectionTable = (typeof COLLECTION_TABLES)[number];
type SingletonTable = (typeof SINGLETON_TABLES)[number];

const collectionSet: ReadonlySet<string> = new Set(COLLECTION_TABLES);
const singletonSet: ReadonlySet<string> = new Set(SINGLETON_TABLES);

function assertCollectionTable(table: string): asserts table is CollectionTable {
  if (!collectionSet.has(table)) {
    throw new Error(`Invalid collection table: ${table}`);
  }
}

function assertSingletonTable(table: string): asserts table is SingletonTable {
  if (!singletonSet.has(table)) {
    throw new Error(`Invalid singleton table: ${table}`);
  }
}

async function ensureCollectionTable(table: CollectionTable) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function ensureSingletonTable(table: SingletonTable) {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS ${table} (
      id text PRIMARY KEY,
      payload jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
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
  assertCollectionTable(table);
  await ensureAdminTables();
  const rows = await sql.query(`SELECT payload FROM ${table} ORDER BY created_at ASC;`);
  return rows.rows.map((row) => row.payload);
}

export async function upsertItem(table: string, item: Record<string, unknown>) {
  assertCollectionTable(table);
  await ensureAdminTables();
  const payload = JSON.stringify(item);
  await sql.query(
    `INSERT INTO ${table} (id, payload)
     VALUES ($1, $2::jsonb)
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload;`,
    [item.id as string, payload]
  );
}

export async function deleteItem(table: string, id: string) {
  assertCollectionTable(table);
  await ensureAdminTables();
  await sql.query(`DELETE FROM ${table} WHERE id = $1;`, [id]);
}

export async function getSingleton<T>(table: string, fallback: T): Promise<T> {
  assertSingletonTable(table);
  await ensureAdminTables();
  const rows = await sql.query(`SELECT payload FROM ${table} WHERE id = 'default' LIMIT 1;`);
  if (!rows.rows[0]?.payload) {
    return fallback;
  }
  return rows.rows[0].payload as T;
}

export async function setSingleton(table: string, payload: Record<string, unknown>) {
  assertSingletonTable(table);
  await ensureAdminTables();
  const data = JSON.stringify(payload);
  await sql.query(
    `INSERT INTO ${table} (id, payload, updated_at)
     VALUES ('default', $1::jsonb, now())
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload, updated_at = now();`,
    [data]
  );
}
