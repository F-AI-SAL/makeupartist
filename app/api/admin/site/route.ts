import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { defaultSiteConfig, type SiteConfig } from "../../../../lib/site";
import { getSingleton, setSingleton } from "../../../../lib/db-admin";
import { isDbEnabled } from "../../../../lib/db";
import { proxyRequest } from "../../../../lib/proxy";

const FILE_PATH = dataPath("site.json");

export async function GET(req: Request) {
  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/site`);
  }
  const data = isDbEnabled()
    ? await getSingleton<SiteConfig>("site", defaultSiteConfig)
    : await readJson<SiteConfig>(FILE_PATH, defaultSiteConfig);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "site", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/admin/site`, {
      "x-admin-password": process.env.ADMIN_PASSWORD || ""
    });
  }

  const body = (await req.json()) as SiteConfig;
  if (isDbEnabled()) {
    await setSingleton("site", body);
  } else {
    await writeJson(FILE_PATH, body);
  }
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "save", data: body });
}
