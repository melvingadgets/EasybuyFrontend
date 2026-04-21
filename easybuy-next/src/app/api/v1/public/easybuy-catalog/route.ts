import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com";

export async function GET(request: NextRequest) {
  const provider = request.nextUrl.searchParams.get("provider") || "";
  const res = await fetch(
    `${BACKEND_URL}/api/v1/public/easybuy-catalog?provider=${encodeURIComponent(provider)}`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
