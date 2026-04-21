import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://easybuytrackerbackend.onrender.com";

export async function GET(request: NextRequest) {
  try {
    const provider = request.nextUrl.searchParams.get("provider") || "";
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    const res = await fetch(
      `${BACKEND_URL}/api/v1/public/easybuy-catalog?provider=${encodeURIComponent(provider)}`,
      {
        next: { revalidate: 60 },
        headers: { ...(clientIp ? { "x-forwarded-for": clientIp } : {}) },
      }
    );

    const data = await res.json().catch(() => ({ message: "Failed to retrieve catalog" }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
