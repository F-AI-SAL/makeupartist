import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

import { bookingSchema } from "../../../lib/validation";
import type { ApiResponse } from "../../../lib/api";
import { dataPath } from "../../../lib/storage";
import { insertBooking, isDbEnabled } from "../../../lib/db";

const BOOKINGS_PATH = dataPath("bookings.json");

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

    const record = { id: requestId, ...parsed.data, createdAt: new Date().toISOString() };
    if (isDbEnabled()) {
      await insertBooking(requestId, parsed.data);
    } else {
      const existingRaw = await fs.readFile(BOOKINGS_PATH, "utf8").catch(() => "[]");
      const existing = JSON.parse(existingRaw) as Array<Record<string, unknown>>;
      existing.push(record);
      await fs.writeFile(BOOKINGS_PATH, JSON.stringify(existing, null, 2));
    }

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

