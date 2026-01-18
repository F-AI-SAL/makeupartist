import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

import { contactSchema } from "../../../lib/validation";
import type { ApiResponse } from "../../../lib/api";
import { dataPath } from "../../../lib/storage";
import { insertContact, isDbEnabled } from "../../../lib/db";

const CONTACTS_PATH = dataPath("contacts.json");

export async function POST(req: Request) {
  const requestId = randomUUID();

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { ok: false, requestId, error: "Invalid contact payload" },
        { status: 400 }
      );
    }

    const record = { id: requestId, ...parsed.data, createdAt: new Date().toISOString() };
    if (isDbEnabled()) {
      await insertContact(requestId, parsed.data);
    } else {
      const existingRaw = await fs.readFile(CONTACTS_PATH, "utf8").catch(() => "[]");
      const existing = JSON.parse(existingRaw) as Array<Record<string, unknown>>;
      existing.push(record);
      await fs.writeFile(CONTACTS_PATH, JSON.stringify(existing, null, 2));
    }

    console.info("[contact]", { requestId, ...parsed.data });

    return NextResponse.json<ApiResponse<typeof record>>({ ok: true, requestId, data: record });
  } catch (error) {
    console.error("[contact:error]", { requestId, error });
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId, error: "Server error" },
      { status: 500 }
    );
  }
}

