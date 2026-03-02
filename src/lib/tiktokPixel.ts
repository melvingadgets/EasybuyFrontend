type TikTokTrackPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    ttq?: any;
    TiktokAnalyticsObject?: string;
  }
}

const pixelId = String(import.meta.env.VITE_TIKTOK_PIXEL_ID || "").trim();
let initialized = false;

const bootstrapTikTok = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.ttq) return;

  const ttq: any = [];
  const methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
  ];

  ttq.setAndDefer = (target: any, method: string) => {
    target[method] = (...args: any[]) => {
      target.push([method, ...args]);
    };
  };

  for (const method of methods) {
    ttq.setAndDefer(ttq, method);
  }

  ttq.load = (id: string) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${encodeURIComponent(
      id
    )}&lib=ttq`;
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag?.parentNode) {
      firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    } else {
      document.head.appendChild(script);
    }
  };

  window.TiktokAnalyticsObject = "ttq";
  window.ttq = ttq;
};

export const initializeTikTokPixel = () => {
  if (!pixelId || initialized) return !!pixelId;
  bootstrapTikTok();
  if (!window.ttq) return false;
  window.ttq.load(pixelId);
  initialized = true;
  return true;
};

export const trackTikTokPageView = () => {
  if (!initializeTikTokPixel()) return;
  window.ttq.page();
};

export const trackTikTokEvent = (eventName: string, payload?: TikTokTrackPayload) => {
  if (!initializeTikTokPixel()) return;
  if (payload && Object.keys(payload).length > 0) {
    window.ttq.track(eventName, payload);
    return;
  }
  window.ttq.track(eventName);
};

