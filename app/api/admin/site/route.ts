import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { defaultSiteConfig, type SiteConfig } from "../../../../lib/site";

const FILE_PATH = dataPath("site.json");

export async function GET() {
  const data = await readJson<SiteConfig>(FILE_PATH, defaultSiteConfig);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "site", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = (await req.json()) as SiteConfig;
  await writeJson(FILE_PATH, body);
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "save", data: body });
}
