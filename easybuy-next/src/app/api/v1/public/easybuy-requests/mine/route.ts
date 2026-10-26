import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backendUrl";

// The signed-in person's own applications (Melvin OS token required; EasyBuy verifies it).
export async function GET(request: NextRequest) {
  const authorization = (request.headers.get("authorization") || "").trim();
  if (!/^Bearer\s+\S+$/i.test(authorization)) {
    return NextResponse.json({ message: "Sign in to see your applications" }, { status: 401 });
  }
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/easybuy-requests/mine`, {
      headers: { authorization },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({ message: "Request failed" }));
    return NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
}
