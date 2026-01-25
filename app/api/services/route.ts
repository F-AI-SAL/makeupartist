import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";
import { getCollection } from "../../../lib/db-admin";
import { isDbEnabled } from "../../../lib/db";

const FILE_PATH = dataPath("services.json");

export async function GET() {
  const data = isDbEnabled()
    ? await getCollection("services")
    : await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "list", data });
}
