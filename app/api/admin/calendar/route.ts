import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";

const FILE_PATH = dataPath("calendar.json");

type CalendarData = { dates: Array<{ date: string; isFull: boolean; slots: string[] }> };

export async function GET() {
  const data = await readJson<CalendarData>(FILE_PATH, { dates: [] });
  return NextResponse.json<ApiResponse<CalendarData>>({ ok: true, requestId: "list", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json()) as CalendarData;
  await writeJson(FILE_PATH, body);
  return NextResponse.json<ApiResponse<CalendarData>>({ ok: true, requestId: "save", data: body });
}
