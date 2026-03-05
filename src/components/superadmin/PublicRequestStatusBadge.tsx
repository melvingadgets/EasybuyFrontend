import type { PublicEasyBuyRequestStatus } from "../../types/api";

const statusStyles: Record<PublicEasyBuyRequestStatus, string> = {
  pending_verification: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
};

type PublicRequestStatusBadgeProps = {
  status: PublicEasyBuyRequestStatus;
};

export const PublicRequestStatusBadge = ({ status }: PublicRequestStatusBadgeProps) => {
  return <span className={`rounded px-2 py-1 text-xs ${statusStyles[status]}`}>{status}</span>;
};
