import { type NextRequest, NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/backendUrl";

// Same-origin proxy for application documents (bank statement, NIN, NIN selfie), like the other
// /api/v1/public routes. Only the applicant's proof of ownership is passed on: a Melvin bearer
// token or the request's upload key. Bodies are forwarded byte for byte so multipart uploads keep
// their boundary. Nothing is logged.

const REQUEST_ID = /^[A-Za-z0-9-]{1,64}$/;
const FILE_ID = /^[0-9a-f-]{36}$/i;
// Vercel functions accept about 4.5 MB per request; EasyBuy caps each file at 4 MB.
const MAX_BODY_BYTES = 4.5 * 1024 * 1024;

export const isRequestId = (value: string) => REQUEST_ID.test(value);
export const isFileId = (value: string) => FILE_ID.test(value);

export const forwardDocuments = async (request: NextRequest, path: string, method: "GET" | "PUT" | "POST" | "DELETE") => {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ code: "file_too_large", message: "That file is over 4 MB. Upload a smaller file." }, { status: 413 });
  }

  const headers: Record<string, string> = { accept: "application/json" };
  const authorization = (request.headers.get("authorization") || "").trim();
  if (/^Bearer\s+\S+$/i.test(authorization)) headers.authorization = authorization;
  const documentsToken = (request.headers.get("x-documents-token") || "").trim();
  if (documentsToken && documentsToken.length <= 200) headers["x-documents-token"] = documentsToken;
  const contentType = request.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  if (clientIp) headers["x-forwarded-for"] = clientIp;

  try {
    const body = method === "GET" || method === "DELETE" ? undefined : Buffer.from(await request.arrayBuffer());
    const res = await fetch(`${BACKEND_URL}/api/v1/public${path}`, { method, headers, body, cache: "no-store" });
    const data = await res.json().catch(() => ({ message: "Request failed" }));
    return NextResponse.json(data, { status: res.status, headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Unable to reach the server. Please try again." }, { status: 502 });
  }
};

export const notFound = () => NextResponse.json({ message: "Application not found" }, { status: 404 });
