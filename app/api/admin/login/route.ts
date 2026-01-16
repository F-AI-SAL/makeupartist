import { NextResponse } from "next/server";

import type { ApiResponse } from "../../../../lib/api";

export async function POST(req: Request) {
  const body = await req.json();
  const password = body?.password as string;
  const expected = process.env.ADMIN_PASSWORD || "admin123";

  if (!password || password !== expected) {
    return NextResponse.json<ApiResponse<null>>(
      { ok: false, requestId: "auth", error: "Invalid password" },
      { status: 401 }
    );
  }

  const response = NextResponse.json<ApiResponse<{ ok: boolean }>>({
    ok: true,
    requestId: "auth",
    data: { ok: true }
  });
  response.cookies.set("admin", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
