// The EasyBuy backend's origin, decided once for the whole app.
//
// Everything used to be relative, which only works because every call goes through `api`/RTK.
// The Apply port talks to the documents routes with plain `fetch` (multipart, so axios's JSON
// handling is no help), so it needs the origin as a value. Keeping the rules in one place means
// a browser opened on the deployed site never sends requests to someone's localhost.

const apiMode = String(import.meta.env.VITE_API_MODE || "online").trim().toLowerCase();
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const localUrl = String(import.meta.env.VITE_API_LOCAL_URL || "http://localhost:552").trim();
const onlineUrl = String(
  import.meta.env.VITE_API_ONLINE_URL || "https://easybuy-api-production.up.railway.app"
).trim();
const onlineFallbackUrl = "https://easybuy-api-production.up.railway.app";

const isLocalhostUrl = (value: string) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized.includes("localhost") || normalized.includes("127.0.0.1");
};

const shouldAvoidLocalhostBase =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";
const isRuntimeLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const selectedBaseUrl =
  envBaseUrl ||
  (apiMode === "local"
    ? localUrl || onlineUrl || onlineFallbackUrl
    : onlineUrl || localUrl || onlineFallbackUrl);

export const backendBaseUrl = (
  isRuntimeLocalhost
    ? selectedBaseUrl
    : shouldAvoidLocalhostBase && isLocalhostUrl(selectedBaseUrl)
      ? onlineUrl || onlineFallbackUrl
      : onlineUrl || onlineFallbackUrl
).replace(/\/+$/, "");

/** Absolute URL for a backend path ("/api/v1/...") — or the path unchanged if it already is one. */
export const backendUrl = (path: string): string =>
  /^https?:\/\//i.test(path) ? path : `${backendBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
