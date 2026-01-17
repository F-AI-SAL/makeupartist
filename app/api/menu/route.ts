import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";
import { defaultServiceMenu, type ServiceMenuData } from "../../../lib/service-menu";

const FILE_PATH = dataPath("service-menu.json");

export async function GET() {
  const data = await readJson<ServiceMenuData>(FILE_PATH, defaultServiceMenu);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "menu", data });
}
