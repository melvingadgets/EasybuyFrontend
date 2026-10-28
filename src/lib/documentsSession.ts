// The application whose documents are being added, kept on this device so the applicant can leave
// and come back. It holds the request's upload key (a 30-day credential for that one application's
// documents) and the down payment for the statement caveat; never the NIN or any file.
//
// Same storage key and expiry as the standalone Apply app on purpose: an applicant who started
// there and comes back through this app keeps the session they already had. One addition: once the
// application is claimed for the signed-in person, the token is dropped and `claimed` records that
// this device can still open the application — through the bearer, which is the durable credential.

const KEY = "easybuy_apply_documents_v1";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export type DocumentsSession = {
  requestId: string;
  /** The upload key, until the application is claimed. */
  documentsToken?: string;
  /** Set once the application belongs to the signed-in person: the bearer is enough from then on. */
  claimed?: boolean;
  /** Set once all three documents are in, so "/apply" stops sending them back to the upload form. */
  complete?: boolean;
  downPaymentNaira?: number;
  whatsAppUrl?: string;
  savedAt: number;
};

export const loadDocumentsSession = (): DocumentsSession | null => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null") as DocumentsSession | null;
    if (!parsed?.requestId) return null;
    // A session is only usable with a credential: the upload key, or a claim made with a sign-in.
    if (!parsed.documentsToken && !parsed.claimed) return null;
    if (Date.now() - Number(parsed.savedAt) > MAX_AGE_MS) return null;
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
