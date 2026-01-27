import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { defaultServiceMenu, type ServiceMenuData } from "../../../../lib/service-menu";
import { getSingleton, setSingleton } from "../../../../lib/db-admin";
import { isDbEnabled } from "../../../../lib/db";
import { proxyRequest } from "../../../../lib/proxy";

const FILE_PATH = dataPath("service-menu.json");

export async function GET(req: Request) {
  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/menu`);
  }
  const data = isDbEnabled()
    ? await getSingleton<ServiceMenuData>("menu", defaultServiceMenu)
    : await readJson<ServiceMenuData>(FILE_PATH, defaultServiceMenu);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "menu", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/admin/menu`, {
      "x-admin-password": process.env.ADMIN_PASSWORD || ""
    });
  }

  const body = (await req.json()) as ServiceMenuData;
  if (isDbEnabled()) {
    await setSingleton("menu", body);
  } else {
    await writeJson(FILE_PATH, body);
  }
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "save", data: body });
}
