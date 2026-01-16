import { NextResponse } from "next/server";

import type { ApiResponse } from "../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";

const FILE_PATH = dataPath("team.json");

export async function GET() {
  const data = await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "list", data });
}
