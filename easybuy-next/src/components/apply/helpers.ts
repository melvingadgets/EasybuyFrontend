import type { PlanType } from "@/components/apply/types";

const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

export const parseFormattedNumber = (value: string) => {
  const sanitized = String(value || "").replace(/[^\d.]/g, "");
  const numeric = Number(sanitized);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const formatInputWithCommas = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return "";

  const hasTrailingDot = cleaned.endsWith(".");
  const [integerPartRaw, decimalRaw = ""] = cleaned.split(".");
  const integerPart = (integerPartRaw || "0").replace(/^0+(?=\d)/, "");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimals = decimalRaw.slice(0, 2);

  if (hasTrailingDot && !decimals.length) {
    return `NGN ${formattedInteger}.`;
  }
  return decimals.length ? `NGN ${formattedInteger}.${decimals}` : `NGN ${formattedInteger}`;
};

export const formatAmount = (value: number) => amountFormatter.format(value || 0);

export const getSafePlan = (plan: string): PlanType => (plan === "Monthly" ? "Monthly" : "Weekly");

export const getOrCreateAnonymousId = () => {
  const key = "easybuy_public_anonymous_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const created =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  localStorage.setItem(key, created);
  return created;
};

const PUBLIC_WHATSAPP_NUMBER = "2347086758713";

export const buildPublicWhatsAppUrl = (params: {
  fullName: string;
  email: string;
  phone: string;
  iphoneModel: string;
  capacity: string;
  plan: "Monthly" | "Weekly";
}) => {
  const message = [
    "Hello Admin, I just submitted an EasyBuy request.",
    `Name: ${params.fullName}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone}`,
    `Device: ${params.iphoneModel} (${params.capacity})`,
    `Plan: ${params.plan}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${PUBLIC_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
};

