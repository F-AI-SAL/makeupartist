import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

import type { ApiResponse } from "../../../lib/api";
import { dataPath, readJson, writeJson } from "../../../lib/storage";

const FILE_PATH = dataPath("payments.json");

export async function POST(req: Request) {
  const requestId = randomUUID();
  const form = await req.formData();

  const phone = (form.get("phone") as string) || "";
  const method = (form.get("method") as string) || "";
  const transactionId = (form.get("transactionId") as string) || "";
  const amount = (form.get("amount") as string) || "";
  const bookingId = (form.get("bookingId") as string) || "";
  const file = form.get("slip") as File | null;

  const phoneRegex = /^01[3-9]\d{8}$/;
  if (!phone || !method || !transactionId || !amount || !phoneRegex.test(phone)) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId, error: "Missing required fields" },
      { status: 400 }
    );
  }

  let slipUrl = "";
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "payments");
    await fs.mkdir(uploadDir, { recursive: true });
    const fullPath = path.join(uploadDir, fileName);
    await fs.writeFile(fullPath, buffer);
    slipUrl = `/uploads/payments/${fileName}`;
  }

  const existing = await readJson(FILE_PATH, [] as Array<Record<string, unknown>>);
  const record = {
    id: requestId,
    phone,
    method,
    transactionId,
    amount,
    bookingId,
    slipUrl,
    createdAt: new Date().toISOString()
  };

  existing.push(record);
  await writeJson(FILE_PATH, existing);

  return NextResponse.json<ApiResponse<typeof record>>({ ok: true, requestId, data: record });
}
