import { api } from "./api";

const getOrCreateAnonymousId = (): string => {
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

export const trackEvent = (event: string, meta?: Record<string, unknown>): void => {
  const anonymousId = getOrCreateAnonymousId();
  const urlParams = new URLSearchParams(window.location.search);
  const safeMeta = meta && typeof meta === "object" && !Array.isArray(meta) ? meta : {};
  const provider = typeof safeMeta.provider === "string" ? safeMeta.provider : undefined;

  api
    .post(
      "/api/v1/public/events",
      {
        anonymousId,
        event,
        provider,
        meta: safeMeta,
        utmSource: urlParams.get("utm_source") || "",
        utmMedium: urlParams.get("utm_medium") || "",
        utmCampaign: urlParams.get("utm_campaign") || "",
        utmTerm: urlParams.get("utm_term") || "",
        utmContent: urlParams.get("utm_content") || "",
        referrer: document.referrer || "",
        landingPage: window.location.href,
      },
      {
        suppressGlobalLoader: true,
        suppressErrorToast: true,
      } as any
    )
    .catch(() => {});
};

