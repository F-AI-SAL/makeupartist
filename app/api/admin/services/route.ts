import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../../lib/storage";
import { assertAdminAuth } from "../../../../lib/admin-auth";
import { deleteItem, getCollection, upsertItem } from "../../../../lib/db-admin";
import { isDbEnabled } from "../../../../lib/db";

const FILE_PATH = dataPath("services.json");

export async function GET() {
  const data = isDbEnabled()
    ? await getCollection("services")
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

  const body = await req.json();
  if (isDbEnabled()) {
    await upsertItem("services", body);
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

  const body = await req.json();
  if (isDbEnabled()) {
    await upsertItem("services", body);
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

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id && isDbEnabled()) {
    await deleteItem("services", id);
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
