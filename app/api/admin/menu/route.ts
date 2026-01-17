import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { defaultServiceMenu, type ServiceMenuData } from "../../../../lib/service-menu";

const FILE_PATH = dataPath("service-menu.json");

export async function GET() {
  const data = await readJson<ServiceMenuData>(FILE_PATH, defaultServiceMenu);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "menu", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json()) as ServiceMenuData;
  await writeJson(FILE_PATH, body);
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "save", data: body });
}
