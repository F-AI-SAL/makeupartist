import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { deleteItem, getCollection, upsertItem } from "../../../../lib/db-admin";
import { isDbEnabled } from "../../../../lib/db";
import { proxyRequest } from "../../../../lib/proxy";

const FILE_PATH = dataPath("offers.json");

export async function GET(req: Request) {
  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/offers`);
  }
  const data = isDbEnabled()
    ? await getCollection("offers")
    : await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
  return NextResponse.json<ApiResponse<typeof data>>({ ok: true, requestId: "list", data });
}

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/admin/offers`, {
      "x-admin-password": process.env.ADMIN_PASSWORD || ""
    });
  }

  const body = await req.json();
  if (isDbEnabled()) {
    await upsertItem("offers", body);
  } else {
    const data = await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
    data.push(body);
    await writeJson(FILE_PATH, data);
  }
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "create", data: body });
}

export async function PUT(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/admin/offers`, {
      "x-admin-password": process.env.ADMIN_PASSWORD || ""
    });
  }

  const body = await req.json();
  if (isDbEnabled()) {
    await upsertItem("offers", body);
  } else {
    const data = await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
    const updated = data.map((item: any) => (item.id === body.id ? body : item));
    await writeJson(FILE_PATH, updated);
  }
  return NextResponse.json<ApiResponse<typeof body>>({ ok: true, requestId: "update", data: body });
}

export async function DELETE(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (process.env.CMS_SERVICE_URL) {
    return proxyRequest(req, `${process.env.CMS_SERVICE_URL}/admin/offers`, {
      "x-admin-password": process.env.ADMIN_PASSWORD || ""
    });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id && isDbEnabled()) {
    await deleteItem("offers", id);
  } else {
    const data = await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
    const filtered = data.filter((item: any) => item.id !== id);
    await writeJson(FILE_PATH, filtered);
  }
  return NextResponse.json<ApiResponse<{ id: string | null }>>({
    ok: true,
    requestId: "delete",
    data: { id }
  });
}
