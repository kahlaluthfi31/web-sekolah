import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime to allow Buffer and streaming fetch
export const runtime = "nodejs";

// GET /api/virtual-tour/proxy?url=<remote>
// Simple pass-through proxy to bypass browser CORS for panorama images.
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ success: false, message: "Missing url" }, { status: 400 });
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok || !upstream.body) {
      console.error("Proxy upstream failed", { url, status: upstream.status, statusText: upstream.statusText });
      return NextResponse.json({ success: false, message: `Upstream error ${upstream.status} for ${url}` }, { status: 502 });
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Proxy fetch failed", { url, err });
    return NextResponse.json({ success: false, message: `Failed to fetch upstream for ${url}` }, { status: 502 });
  }
}
