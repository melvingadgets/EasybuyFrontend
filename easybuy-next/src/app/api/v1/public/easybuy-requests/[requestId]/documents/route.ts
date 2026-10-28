import type { NextRequest } from "next/server";
import { forwardDocuments, isRequestId, notFound } from "@/lib/documentsProxy";

// The applicant's documents status (never the NIN itself or any file).
export async function GET(request: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  if (!isRequestId(requestId)) return notFound();
  return forwardDocuments(request, `/easybuy-requests/${encodeURIComponent(requestId)}/documents`, "GET");
}
