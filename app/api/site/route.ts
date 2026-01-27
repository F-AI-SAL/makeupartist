import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson } from "../../../lib/storage";
import { defaultSiteConfig, type SiteConfig } from "../../../lib/site";
import { getSingleton } from "../../../lib/db-admin";
import { isDbEnabled } from "../../../lib/db";
import { proxyRequest } from "../../../lib/proxy";

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
