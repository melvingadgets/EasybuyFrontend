"use client";

// The application the applicant is adding documents to, kept on this device so they can leave and
// come back. It holds the request's upload key (a 30-day credential for that one application's
// documents) and the down payment for the statement caveat; never the NIN or any file.

const KEY = "easybuy_apply_documents_v1";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type DocumentsSession = {
  requestId: string;
  documentsToken: string;
  downPaymentNaira?: number;
  whatsAppUrl?: string;
  savedAt: number;
};

export const loadDocumentsSession = (): DocumentsSession | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null") as DocumentsSession | null;
    if (!parsed?.requestId || !parsed.documentsToken || Date.now() - Number(parsed.savedAt) > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveDocumentsSession = (session: DocumentsSession) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // Still usable for this visit without storage.
  }
};

export const clearDocumentsSession = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
};
