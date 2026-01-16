import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

import type { ApiResponse } from "../../../../lib/api";
import { assertAdminAuth } from "../../../../lib/admin-auth";

export async function POST(req: Request) {
  if (!assertAdminAuth()) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Unauthorized" },
      { status: 401 }
    );
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = (form.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "file", error: "No file provided" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(uploadDir, { recursive: true });
  const fullPath = path.join(uploadDir, fileName);
  await fs.writeFile(fullPath, buffer);

  const url = `/uploads/${folder}/${fileName}`;
  return NextResponse.json<ApiResponse<{ url: string }>>({
    ok: true,
    requestId: "upload",
    data: { url }
  });
}
