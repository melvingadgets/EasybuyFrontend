import ClipLoader from "react-spinners/ClipLoader";
import { getRtkErrorMessage } from "../../lib/rtkError";
import { formatDateTime } from "../../lib/superadminFormat";
import { useGetSuperAdminPublicEasyBuyRequestDocumentsQuery } from "../../store/api/backendApi";

// A request's application documents for review: the NIN, the bank statement files and the photo of
// the applicant holding their NIN. Links are signed and expire after a few minutes; every open is
// recorded in the audit log. Never shown to resellers.

type Props = {
  requestId: string;
  applicantName?: string;
  onClose: () => void;
};

const MISSING_LABEL: Record<string, string> = {
  bank_statement: "Bank statement",
  nin: "NIN",
  nin_selfie: "Photo holding NIN",
};

const size = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

export const ApplicationDocumentsModal = ({ requestId, applicantName, onClose }: Props) => {
  const query = useGetSuperAdminPublicEasyBuyRequestDocumentsQuery(requestId, { refetchOnMountOrArgChange: true });
  const documents = query.data?.data;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Documents for ${requestId}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Application documents</h2>
            <p className="text-xs text-muted-foreground">
              {applicantName ? `${applicantName} · ` : ""}
              {requestId}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted">
            Close
          </button>
        </div>

        {query.isFetching && !documents ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <ClipLoader size={16} color="currentColor" /> Loading documents…
          </div>
        ) : query.error ? (
          <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {getRtkErrorMessage(query.error as any, "Couldn't load the documents")}
          </p>
        ) : documents ? (
          <div className="mt-4 space-y-4 text-sm">
            {documents.complete ? (
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">All three documents are in.</p>
            ) : (
              <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
                Missing: {documents.missing.map((item) => MISSING_LABEL[item] ?? item).join(", ")}.
                {documents.required ? " The request can't be approved until these are uploaded." : ""}
              </p>
            )}

            <section>
              <h3 className="font-semibold">NIN</h3>
              {documents.nin.provided && documents.nin.value ? (
                <p className="mt-1 font-mono text-base tracking-wider">{documents.nin.value}</p>
              ) : documents.ninUnreadable ? (
                <p className="mt-1 text-destructive">A NIN was saved but can't be read (encryption key mismatch).</p>
              ) : (
                <p className="mt-1 text-muted-foreground">Not provided yet.</p>
              )}
            </section>

            <section>
              <h3 className="font-semibold">Bank statement (last 3 months)</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {documents.downPaymentConfirmed
                  ? "The applicant confirmed the down payment was in the account before generating it."
                  : "No down-payment confirmation yet."}
              </p>
              {documents.bankStatements.length ? (
                <ul className="mt-2 space-y-2">
                  {documents.bankStatements.map((file, index) => (
                    <li key={file.fileId} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                      <span>
                        File {index + 1} · {file.format.toUpperCase()} · {size(file.bytes)}
                        <span className="block text-xs text-muted-foreground">{formatDateTime(file.uploadedAt)}</span>
                      </span>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90">
                        Open
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-muted-foreground">Not uploaded yet.</p>
              )}
            </section>

            <section>
              <h3 className="font-semibold">Photo holding NIN</h3>
              {documents.ninSelfie ? (
                <div className="mt-2 space-y-2">
                  <a href={documents.ninSelfie.url} target="_blank" rel="noopener noreferrer">
                    <img src={documents.ninSelfie.url} alt="Applicant holding their NIN" className="max-h-80 w-full rounded-lg bg-muted object-contain" />
                  </a>
                  <p className="text-xs text-muted-foreground">Check the face matches and the NIN on the card matches the number above.</p>
                </div>
              ) : (
                <p className="mt-1 text-muted-foreground">Not uploaded yet.</p>
              )}
            </section>

            <p className="text-xs text-muted-foreground">
              Links expire in {Math.round(documents.linkExpiresInSeconds / 60)} minutes. Close and reopen to get new ones. Each
              view is recorded.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
