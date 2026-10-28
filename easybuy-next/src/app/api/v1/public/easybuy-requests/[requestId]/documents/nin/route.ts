import type { NextRequest } from "next/server";
import { forwardDocuments, isRequestId, notFound } from "@/lib/documentsProxy";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  if (!isRequestId(requestId)) return notFound();
  return forwardDocuments(request, `/easybuy-requests/${encodeURIComponent(requestId)}/documents/nin`, "PUT");
}
