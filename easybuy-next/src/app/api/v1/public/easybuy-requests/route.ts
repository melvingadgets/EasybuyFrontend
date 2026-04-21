import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://easybuytrackerbackend.onrender.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    const res = await fetch(`${BACKEND_URL}/api/v1/public/easybuy-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ message: "Request failed" }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
