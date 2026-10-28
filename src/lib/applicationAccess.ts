import type { MyEasyBuyApplication } from "../types/api";

// What a signed-in customer may see, decided from their applications and their financed items.
//
// The finance screens (dashboard, items, receipts) only mean anything once a request has been
// converted into an EasyBoughtItem. Before that there is a state to show instead of a screen full
// of zeros — and, for "approved", a real milestone worth its own message.
//
// This is a pure function on purpose: the routing rules are the part that breaks quietly, so they
// are unit-tested (test/applicationAccess.test.ts) rather than only clicked through.

export type AccessDecision =
  /** A customer whose loan exists: today's dashboard, unchanged. */
  | { kind: "open" }
  /** Approved, being set up: no loan numbers yet. */
  | { kind: "activating"; request: MyEasyBuyApplication }
  /** Still being reviewed: documents can be added. */
  | { kind: "under_review"; request: MyEasyBuyApplication }
  /** Turned down. */
  | { kind: "rejected"; request: MyEasyBuyApplication }
  /** Converted, but no item is linked to this person: a support case, not an empty dashboard. */
  | { kind: "converted_unlinked"; request: MyEasyBuyApplication }
  /** No applications at all. */
  | { kind: "no_applications" };

// An old rejection should not hide a newer live application: the most advanced one decides.
const PRIORITY: Record<MyEasyBuyApplication["status"], number> = {
  converted: 5,
  approved: 4,
  verified: 3,
  pending_verification: 2,
  rejected: 1,
};

export const latestByPriority = (requests: MyEasyBuyApplication[]): MyEasyBuyApplication | null =>
  [...requests].sort((a, b) => (PRIORITY[b.status] || 0) - (PRIORITY[a.status] || 0))[0] || null;

/**
 * @param requests  the person's applications, from `/api/v1/public/easybuy-requests/mine`
 * @param hasItems  whether `/api/v1/user/geteasyboughtitems` returned at least one financed item
 */
export const decideApplicationAccess = (
  requests: MyEasyBuyApplication[],
  hasItems: boolean
): AccessDecision => {
  const latest = latestByPriority(requests);
  if (!latest) return { kind: "no_applications" };

  switch (latest.status) {
    case "converted":
      return hasItems ? { kind: "open" } : { kind: "converted_unlinked", request: latest };
    case "approved":
      return { kind: "activating", request: latest };
    case "rejected":
      return { kind: "rejected", request: latest };
    case "verified":
    case "pending_verification":
    default:
      return { kind: "under_review", request: latest };
  }
};
