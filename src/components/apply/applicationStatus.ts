import type { PublicEasyBuyRequestStatus } from "../../types/api";

// One place for "what does this status mean to the applicant", used by the status list, the form's
// "my applications" panel and the approval gate. The wording is the applicant's, not the system's:
// "pending_verification" is still "Received" to them.

export type ApplicationStatusStyle = { label: string; tone: string; description: string };

export const APPLICATION_STATUS: Record<PublicEasyBuyRequestStatus, ApplicationStatusStyle> = {
  pending_verification: {
    label: "Received",
    tone: "bg-amber-100 text-amber-800",
    description: "We have your application. Add the documents below so we can review it.",
  },
  verified: {
    label: "Under review",
    tone: "bg-amber-100 text-amber-800",
    description: "Your documents are in and Melvin Gadgets is reviewing them.",
  },
  approved: {
    label: "Approved: come collect",
    tone: "bg-sky-100 text-sky-800",
    description: "You're approved. Melvin Gadgets is setting up your account.",
  },
  rejected: {
    label: "Not approved",
    tone: "bg-red-100 text-red-700",
    description: "This application wasn't approved. You can apply again.",
  },
  converted: {
    label: "Collected",
    tone: "bg-emerald-100 text-emerald-800",
    description: "Your phone is with you. Your repayments are on the dashboard.",
  },
};

/** Applications that can still take documents: approval or rejection locks them. */
export const OPEN_STATUSES = new Set<PublicEasyBuyRequestStatus>(["pending_verification", "verified"]);

/** The gate's unlock point: from here the app shell opens (still "activating" until `converted`). */
export const UNLOCKED_STATUSES = new Set<PublicEasyBuyRequestStatus>(["approved", "converted"]);

export const statusStyle = (status: PublicEasyBuyRequestStatus | string | undefined): ApplicationStatusStyle =>
  (status && APPLICATION_STATUS[status as PublicEasyBuyRequestStatus]) || {
    label: status || "Unknown",
    tone: "bg-muted text-foreground",
    description: "",
  };
