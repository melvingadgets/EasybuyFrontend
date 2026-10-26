import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backendUrl";

// A Melvin user token, when Apply runs inside Melvin OS, is passed through untouched: EasyBuy
// verifies it and links the request to the person (Shortwork/RESELLER-PLAN.md §7). Anything that
// isn't a bearer token is dropped.
const bearerFrom = (request: NextRequest): string | null => {
  const header = request.headers.get("authorization") || "";
  return /^Bearer\s+\S+$/i.test(header.trim()) ? header.trim() : null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const authorization = bearerFrom(request);

    const res = await fetch(`${BACKEND_URL}/api/v1/public/easybuy-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "x-forwarded-for": clientIp } : {}),
        ...(authorization ? { authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ message: "Request failed" }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
