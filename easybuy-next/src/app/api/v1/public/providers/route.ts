import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com";

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/api/v1/public/providers`, {
    next: { revalidate: 60 },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
