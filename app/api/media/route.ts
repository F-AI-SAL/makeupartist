import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";
import { getCollection } from "../../../lib/db-admin";
import { isDbEnabled } from "../../../lib/db";
import { proxyRequest } from "../../../lib/proxy";

const FILE_PATH = dataPath("media.json");

export async function GET(req: Request) {
  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/media`);
  }
  const data = isDbEnabled()
    ? await getCollection("media")
    : await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "list", data });
}
