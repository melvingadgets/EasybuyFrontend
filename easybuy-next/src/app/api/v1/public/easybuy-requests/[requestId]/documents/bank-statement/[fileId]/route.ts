import type { NextRequest } from "next/server";
import { forwardDocuments, isFileId, isRequestId, notFound } from "@/lib/documentsProxy";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ requestId: string; fileId: string }> }) {
  const { requestId, fileId } = await params;
  if (!isRequestId(requestId) || !isFileId(fileId)) return notFound();
  return forwardDocuments(
    request,
    `/easybuy-requests/${encodeURIComponent(requestId)}/documents/bank-statement/${encodeURIComponent(fileId)}`,
    "DELETE"
  );
}
