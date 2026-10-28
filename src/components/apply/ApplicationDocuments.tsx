import { useCallback, useEffect, useId, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { backendUrl } from "../../lib/backendBase";
import { formatAmount } from "./helpers";

// "Complete your application": after submitting, the applicant adds their last three months' bank
// statement, their NIN and a photo of themselves holding their NIN. EasyBuy needs all three before
// it can approve. Files go straight from the browser to EasyBuy (a SPA has no server function to
// proxy through), which keeps them private; nothing here stores a file or the NIN in the browser.

type Summary = {
  requestId: string;
  status?: "pending_verification" | "verified" | "approved" | "rejected" | "converted";
  required: boolean;
  editable: boolean;
  complete: boolean;
  missing: Array<"bank_statement" | "nin" | "nin_selfie">;
  bankStatements: Array<{ fileId: string; format: string; bytes: number; uploadedAt: string }>;
  downPaymentConfirmed: boolean;
  nin: { provided: boolean; last4?: string };
  ninSelfie: { uploadedAt: string } | null;
  limits: { maxFileBytes: number; maxBankStatements: number };
};

export type DocumentsAuth = { documentsToken?: string; bearer?: string | null };

type Props = {
  requestId: string;
  auth: DocumentsAuth;
  /** The down payment the applicant chose, in naira, when known. */
  downPaymentNaira?: number;
  whatsAppUrl?: string;
  onStartNew?: () => void;
  /** Inside "My applications": no outer heading or start-new link. */
  compact?: boolean;
  /** Reported whenever the documents summary changes, so the caller can remember what's still missing. */
  onSummary?: (summary: { complete: boolean; status?: Summary["status"] }) => void;
};

const MAX_FILE_BYTES = 4 * 1024 * 1024;

const headersFor = (auth: DocumentsAuth): Record<string, string> => ({
  ...(auth.documentsToken ? { "x-documents-token": auth.documentsToken } : {}),
  ...(auth.bearer ? { Authorization: `Bearer ${auth.bearer}` } : {}),
});

const readError = async (res: Response) => {
  const body = await res.json().catch(() => null);
  return String(body?.message || "Something went wrong. Please try again.");
};

/**
 * Shrinks a photo in the browser so it fits the 4 MB limit. Re-encoding also drops the photo's
 * metadata (such as location). Returns the original file if it can't be read as an image.
 */
const shrinkImage = async (file: File, maxSide: number): Promise<Blob> => {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
};

const kb = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

function StepCard({ index, title, done, children }: { index: number; title: string; done: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold ${done ? "bg-emerald-600 text-white" : "bg-muted text-foreground"}`}
          aria-hidden="true"
        >
          {done ? "✓" : index}
        </span>
        <h3 className="text-base font-semibold">
          {title}
          <span className="sr-only">{done ? " (done)" : " (to do)"}</span>
        </h3>
      </div>
      <div className="mt-3 space-y-3 text-sm">{children}</div>
    </section>
  );
}

function FilePicker({ label, accept, disabled, onPick }: { label: string; accept: string; disabled?: boolean; onPick: (file: File) => void }) {
  const inputId = useId();
  return (
    <>
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) onPick(file);
        }}
      />
      <label
        htmlFor={inputId}
        aria-disabled={disabled}
        className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 text-base font-medium ${
          disabled ? "cursor-not-allowed bg-muted text-muted-foreground" : "cursor-pointer bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {label}
      </label>
    </>
  );
}

export function ApplicationDocuments({ requestId, auth, downPaymentNaira, whatsAppUrl, onStartNew, compact = false, onSummary }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState<"statement" | "nin" | "selfie" | null>(null);
  const [errors, setErrors] = useState<Partial<Record<"statement" | "nin" | "selfie", string>>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [ninInput, setNinInput] = useState("");
  const [editingNin, setEditingNin] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState("");
  const previewRef = useRef("");
  const confirmId = useId();
  const ninId = useId();

  // Keyed on the token strings, so a parent passing a new `auth` object doesn't trigger a reload.
  const { documentsToken, bearer } = auth;
  const request = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(backendUrl(`/api/v1/public/easybuy-requests/${encodeURIComponent(requestId)}/documents${path}`), {
        ...init,
        headers: { ...headersFor({ documentsToken, bearer }), ...(init.headers as Record<string, string> | undefined) },
        cache: "no-store",
      }),
    [documentsToken, bearer, requestId]
  );

  useEffect(() => {
    let active = true;
    request("")
      .then(async (res) => {
        if (!active) return;
        if (!res.ok) return setLoadError(res.status === 404 ? "We couldn't open this application's documents." : await readError(res));
        const body = await res.json();
        setSummary(body.data);
        setConfirmed(Boolean(body.data?.downPaymentConfirmed));
      })
      .catch(() => active && setLoadError("We couldn't reach the server. Check your connection and try again."));
    return () => {
      active = false;
    };
  }, [request]);

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  // Report every summary that arrives, without re-running when the parent passes a new callback.
  const onSummaryRef = useRef(onSummary);
  onSummaryRef.current = onSummary;
  useEffect(() => {
    if (!summary) return;
    onSummaryRef.current?.({ complete: summary.complete, status: summary.status });
  }, [summary]);

  const setError = (key: "statement" | "nin" | "selfie", message = "") => setErrors((prev) => ({ ...prev, [key]: message }));

  const upload = async (key: "statement" | "selfie", file: File) => {
    setError(key);
    const isImage = file.type.startsWith("image/");
    const body = isImage ? await shrinkImage(file, key === "selfie" ? 1600 : 2400) : file;
    if (body.size > MAX_FILE_BYTES) {
      return setError(key, "That file is over 4 MB. Upload a smaller file, or a photo of each page.");
    }
    const form = new FormData();
    form.append("file", body, isImage ? "upload.jpg" : file.name);
    if (key === "statement") form.append("downPaymentConfirmed", confirmed ? "true" : "false");
    setBusy(key);
    try {
      const res = await request(key === "statement" ? "/bank-statement" : "/nin-selfie", { method: "POST", body: form });
      if (!res.ok) return setError(key, await readError(res));
      setSummary((await res.json()).data);
      if (key === "selfie") {
        if (previewRef.current) URL.revokeObjectURL(previewRef.current);
        previewRef.current = URL.createObjectURL(body);
        setSelfiePreview(previewRef.current);
      }
    } catch {
      setError(key, "Upload failed. Check your connection and try again.");
    } finally {
      setBusy(null);
    }
  };

  const removeStatement = async (fileId: string) => {
    setError("statement");
    setBusy("statement");
    try {
      const res = await request(`/bank-statement/${encodeURIComponent(fileId)}`, { method: "DELETE" });
      if (!res.ok) return setError("statement", await readError(res));
      setSummary((await res.json()).data);
    } finally {
      setBusy(null);
    }
  };

  const saveNin = async () => {
    setError("nin");
    const digits = ninInput.replace(/\s+/g, "");
    if (!/^\d{11}$/.test(digits)) return setError("nin", "Your NIN is 11 digits.");
    setBusy("nin");
    try {
      const res = await request("/nin", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nin: digits }) });
      if (!res.ok) return setError("nin", await readError(res));
      setSummary((await res.json()).data);
      setNinInput("");
      setEditingNin(false);
    } catch {
      setError("nin", "We couldn't save your NIN. Try again.");
    } finally {
      setBusy(null);
    }
  };

  if (loadError) {
    return (
      <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
        {loadError}
      </div>
    );
  }
  if (!summary) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground" role="status">
        <ClipLoader size={16} color="currentColor" /> Loading your documents…
      </div>
    );
  }

  const done = 3 - summary.missing.length;
  const statementsDone = summary.bankStatements.length > 0;
  const ninDone = summary.nin.provided;
  const selfieDone = Boolean(summary.ninSelfie);
  const editable = summary.editable;
  const atStatementLimit = summary.bankStatements.length >= summary.limits.maxBankStatements;
  const downPaymentText = downPaymentNaira && downPaymentNaira > 0 ? ` of ${formatAmount(downPaymentNaira)}` : "";

  return (
    <div className="space-y-4">
      {!compact ? (
        <div>
          <h2 className="text-xl font-semibold">Complete your application</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your request <span className="font-medium text-foreground">{summary.requestId}</span> is in. Add these three
            documents so Melvin Gadgets can review it. You can come back to finish later on any device you sign in on.
          </p>
        </div>
      ) : null}

      <div className="flex items-center gap-3" aria-live="polite">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${(done / 3) * 100}%` }} />
        </div>
        <span className="text-sm font-medium">{done} of 3 done</span>
      </div>

      {!editable ? (
        <p className="rounded-lg border border-border bg-muted p-3 text-sm">
          This application has been reviewed, so its documents can no longer be changed.
        </p>
      ) : null}

      <StepCard index={1} title="Bank statement: last 3 months" done={statementsDone}>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
          <p className="font-semibold">Before you generate your statement</p>
          <p className="mt-1">
            Make sure your down payment{downPaymentText} is already in this bank account. We use the statement to confirm
            you can pay it, so a statement generated before the money arrived can&apos;t be accepted.
          </p>
        </div>

        {summary.bankStatements.length ? (
          <ul className="space-y-2">
            {summary.bankStatements.map((file, index) => (
              <li key={file.fileId} className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
                <span className="min-w-0 truncate">
                  Statement {index + 1} · {file.format.toUpperCase()} · {kb(file.bytes)}
                </span>
                {editable ? (
                  <button
                    type="button"
                    onClick={() => removeStatement(file.fileId)}
                    disabled={busy !== null}
                    className="min-h-11 shrink-0 rounded-md px-3 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    Remove
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {editable && !atStatementLimit ? (
          <>
            <label htmlFor={confirmId} className="flex cursor-pointer items-start gap-3">
              <input
                id={confirmId}
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-[hsl(var(--primary))]"
              />
              <span>My down payment is in this account, and I generated this statement after it arrived.</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <FilePicker
                label={busy === "statement" ? "Uploading…" : statementsDone ? "Add another file" : "Upload statement"}
                accept="application/pdf,image/*"
                disabled={!confirmed || busy !== null}
                onPick={(file) => upload("statement", file)}
              />
              <span className="text-xs text-muted-foreground">
                PDF or photo, up to 4 MB each, {summary.limits.maxBankStatements} files at most.
              </span>
            </div>
            {!confirmed ? <p className="text-xs text-muted-foreground">Tick the box above to upload.</p> : null}
          </>
        ) : null}
        {errors.statement ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.statement}
          </p>
        ) : null}
      </StepCard>

      <StepCard index={2} title="Your NIN" done={ninDone}>
        {ninDone && !editingNin ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              NIN ending in <span className="font-semibold">{summary.nin.last4}</span> saved.
            </span>
            {editable ? (
              <button type="button" onClick={() => setEditingNin(true)} className="min-h-11 rounded-md border border-border px-3 text-sm hover:bg-muted">
                Change
              </button>
            ) : null}
          </div>
        ) : editable ? (
          <>
            <label htmlFor={ninId} className="block font-medium">
              National Identification Number (11 digits)
            </label>
            <div className="flex gap-2">
              <input
                id={ninId}
                inputMode="numeric"
                autoComplete="off"
                maxLength={13}
                value={ninInput}
                onChange={(event) => setNinInput(event.target.value.replace(/[^\d\s]/g, ""))}
                placeholder="e.g. 12345678901"
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={saveNin}
                disabled={busy !== null}
                className="min-h-11 shrink-0 rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {busy === "nin" ? "Saving…" : "Save"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Only Melvin Gadgets&apos; review team can see it.</p>
          </>
        ) : null}
        {errors.nin ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.nin}
          </p>
        ) : null}
      </StepCard>

      <StepCard index={3} title="A photo of you holding your NIN" done={selfieDone}>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Stand in good light and hold your NIN slip or card in one hand, next to your face.</li>
          <li>Make sure your face and the NIN details are both clear and readable.</li>
          <li>No filters, and don&apos;t cover any part of the card.</li>
        </ul>
        {selfieDone ? (
          <div className="flex items-center gap-3">
            {selfiePreview ? <img src={selfiePreview} alt="Your uploaded photo" className="size-16 rounded-lg object-cover" /> : null}
            <span>Photo received.</span>
          </div>
        ) : null}
        {editable ? (
          <FilePicker
            label={busy === "selfie" ? "Uploading…" : selfieDone ? "Replace photo" : "Take or upload photo"}
            accept="image/*"
            disabled={busy !== null}
            onPick={(file) => upload("selfie", file)}
          />
        ) : null}
        {errors.selfie ? (
          <p className="text-sm text-destructive" role="alert">
            {errors.selfie}
          </p>
        ) : null}
      </StepCard>

      {summary.complete ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
          <p className="text-base font-semibold">All documents received</p>
          <p className="mt-1">Melvin Gadgets will review your application and contact you.</p>
        </div>
      ) : null}

      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
        Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the phone.
      </p>

      {!compact ? (
        <div className="flex flex-wrap gap-2">
          {whatsAppUrl ? (
            <a
              href={whatsAppUrl}
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:opacity-90"
            >
              Contact Melvin Gadgets on WhatsApp
            </a>
          ) : null}
          {onStartNew ? (
            <button type="button" onClick={onStartNew} className="min-h-11 rounded-md border border-border bg-background px-4 text-base hover:bg-muted">
              Apply for another device
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
