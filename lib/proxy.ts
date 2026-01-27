import { NextResponse } from "next/server";

export async function proxyRequest(req: Request, url: string, extraHeaders?: Record<string, string>) {
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("content-length");
  if (extraHeaders) {
    Object.entries(extraHeaders).forEach(([key, value]) => headers.set(key, value));
  }

  const method = req.method;
  const body = method === "GET" || method === "HEAD" ? undefined : await req.text();

  const response = await fetch(url, { method, headers, body });
  const text = await response.text();

  return new NextResponse(text, {
    status: response.status,
    headers: response.headers
  });
}
