import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";
import { defaultServiceMenu, type ServiceMenuData } from "../../../lib/service-menu";
import { getSingleton } from "../../../lib/db-admin";
import { isDbEnabled } from "../../../lib/db";

const FILE_PATH = dataPath("service-menu.json");

export async function GET() {
  const data = isDbEnabled()
    ? await getSingleton<ServiceMenuData>("menu", defaultServiceMenu)
    : await readJson<ServiceMenuData>(FILE_PATH, defaultServiceMenu);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "menu", data });
}
