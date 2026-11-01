import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.SERELEUM_BASE_URL!;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function handler(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  const endpoint = path.map(encodeURIComponent).join("/");
  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint}${request.nextUrl.search}`;

  const headers = new Headers();

  for (const key of ["content-type", "accept", "authorization"]) {
    const value = request.headers.get(key);
    if (value) headers.set(key, value);
  }

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
      signal: request.signal,
    });

    const responseHeaders = new Headers();

    for (const key of [
      "content-type",
      "content-disposition",
      "cache-control",
    ]) {
      const value = response.headers.get(key);
      if (value) responseHeaders.set(key, value);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Sereleum API error:", error);

    return NextResponse.json(
      { error: "Failed to communicate with Sereleum backend" },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;