import { FaWhatsapp } from "react-icons/fa";
import { formatDateTime } from "../../lib/superadminFormat";
import type { PublicEasyBuyAbandonedDraft, PublicEasyBuyRequest } from "../../types/api";

type PublicEasyBuySubmission = PublicEasyBuyRequest | PublicEasyBuyAbandonedDraft;

type PublicSubmissionDetailsModalProps = {
  item: PublicEasyBuySubmission | null;
  title: string;
  onClose: () => void;
};

const ORDERED_KEYS = [
  "requestId",
  "fullName",
  "email",
  "phone",
  "anonymousId",
  "currentStep",
  "iphoneModel",
  "capacity",
  "plan",
  "status",
  "rejectionReason",
  "reviewedAt",
  "verifiedAt",
  "approvedAt",
  "rejectedAt",
  "convertedAt",
  "createdAt",
  "updatedAt",
  "reviewedBy",
  "convertedEasyBoughtItemId",
];

const DATE_FIELDS = new Set([
  "reviewedAt",
  "verifiedAt",
  "approvedAt",
  "rejectedAt",
  "convertedAt",
  "createdAt",
  "updatedAt",
]);

const isSkippableValue = (value: unknown) => value === undefined || value === null || value === "";

const LABEL_OVERRIDES: Record<string, string> = {
  createdAt: "Request Submission Date",
};

const toLabel = (key: string) =>
  LABEL_OVERRIDES[key] ??
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (segment) => segment.toUpperCase())
    .replace(/_/g, " ");

const renderValueForDisplay = (key: string, value: unknown): string => {
  if (isSkippableValue(value)) return "-";
  if (DATE_FIELDS.has(key) && typeof value === "string") return formatDateTime(value);

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.length ? value.map((item) => renderValueForDisplay("item", item)).join(", ") : "-";
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(([, itemValue]) => !isSkippableValue(itemValue));
    if (entries.length === 0) return "-";
    return entries
      .map(([nestedKey, nestedValue]) => `${toLabel(nestedKey)}: ${renderValueForDisplay(nestedKey, nestedValue)}`)
      .join(", ");
  }

  return "-";
};

const getOrderedEntries = (item: Record<string, unknown>) => {
  const entries = Object.entries(item).filter(([, value]) => !isSkippableValue(value));
  const ordered = ORDERED_KEYS.flatMap((key) => (Object.prototype.hasOwnProperty.call(item, key) ? [[key, item[key]]] : []));
  const extras = entries.filter(([key]) => !ORDERED_KEYS.includes(key));
  return [...ordered, ...extras];
};

const buildWhatsappMessage = (item: Record<string, unknown>) =>
  getOrderedEntries(item)
    .map(([key, value]) => `${toLabel(key)}: ${renderValueForDisplay(key, value)}`)
    .join("\n");

const normalizeWhatsAppNumber = (phone: string) => phone.replace(/\D/g, "");

export const PublicSubmissionDetailsModal = ({ item, onClose, title }: PublicSubmissionDetailsModalProps) => {
  if (!item) return null;

  const payload = buildWhatsappMessage(item as Record<string, unknown>);
  const phone = typeof item.phone === "string" ? item.phone : "";
  const whatsappNumber = normalizeWhatsAppNumber(phone);
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}${payload ? `?text=${encodeURIComponent(payload)}` : ""}`
    : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center"
    >
      <article className="w-full max-w-2xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Submitted details captured from the request</p>
          </div>

          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700"
            >
              <FaWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-md border border-input bg-muted px-3 py-2 text-xs text-muted-foreground">
              <FaWhatsapp className="h-4 w-4" />
              No phone
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2 text-sm">
          {getOrderedEntries(item as Record<string, unknown>).map(([key, value]) => {
            return (
              <div key={key} className="rounded-lg bg-background p-3">
                <p className="text-xs uppercase text-muted-foreground">{toLabel(key)}</p>
                <p className="mt-1 break-words">{renderValueForDisplay(key, value)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border bg-background px-3 py-2 text-xs hover:bg-muted"
          >
            Close
          </button>
        </div>
      </article>
    </div>
  );
};
