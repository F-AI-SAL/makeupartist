import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { bookingSchema } from "../../../lib/validation";
import type { ApiResponse } from "../../../lib/api";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

export async function POST(req: Request) {
  const requestId = randomUUID();

  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { ok: false, requestId, error: "Invalid booking payload" },
        { status: 400 }
      );
    }

    const existingRaw = await fs.readFile(BOOKINGS_PATH, "utf8").catch(() => "[]");
    const existing = JSON.parse(existingRaw) as Array<Record<string, unknown>>;
    const record = { id: requestId, ...parsed.data, createdAt: new Date().toISOString() };

    existing.push(record);
    await fs.writeFile(BOOKINGS_PATH, JSON.stringify(existing, null, 2));

    console.info("[booking]", { requestId, ...parsed.data });

    return NextResponse.json<ApiResponse<typeof record>>({ ok: true, requestId, data: record });
  } catch (error) {
    console.error("[booking:error]", { requestId, error });
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId, error: "Server error" },
      { status: 500 }
    );
  }
}

