import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "./auth";
import { beginGlobalLoad } from "./globalLoading";
import { isMelvinBridgeToken, reportBridgeResponse } from "./melvinBridge";

type RequestMeta = {
  // Set when the request carried the Melvin OS token, so its answer can teach the bridge gate.
  __bridgeToken?: string;
  __stopGlobalLoad?: () => void;
  suppressGlobalLoader?: boolean;
  suppressErrorToast?: boolean;
};

const stopGlobalLoad = (config?: RequestMeta) => {
  config?.__stopGlobalLoad?.();
  if (config) {
    config.__stopGlobalLoad = undefined;
  }
};

const apiMode = String(import.meta.env.VITE_API_MODE || "online").trim().toLowerCase();
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const localUrl = String(import.meta.env.VITE_API_LOCAL_URL || "http://localhost:552").trim();
const onlineUrl = String(
  import.meta.env.VITE_API_ONLINE_URL || "https://easybuytrackerbackend-bocj.onrender.com"
).trim();
const onlineFallbackUrl = "https://easybuytrackerbackend-bocj.onrender.com";

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

const selectedBaseURL =
  envBaseUrl ||
  (apiMode === "local"
    ? localUrl || onlineUrl || onlineFallbackUrl
    : onlineUrl || localUrl || onlineFallbackUrl);

const baseURL = isRuntimeLocalhost
  ? selectedBaseURL
  : shouldAvoidLocalhostBase && isLocalhostUrl(selectedBaseURL)
    ? onlineUrl || onlineFallbackUrl
    : onlineUrl || onlineFallbackUrl;

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const meta = config as typeof config & RequestMeta;
  if (!meta.suppressGlobalLoader) {
    meta.__stopGlobalLoad = beginGlobalLoad();
  }

  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    if (isMelvinBridgeToken(token)) meta.__bridgeToken = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const meta = response.config as RequestMeta;
    stopGlobalLoad(meta);
    if (meta.__bridgeToken) reportBridgeResponse(meta.__bridgeToken, response.status);
    return response;
  },
  (error) => {
    const config = (error?.config || undefined) as RequestMeta | undefined;
    stopGlobalLoad(config);

    const canceled = error?.code === "ERR_CANCELED" || axios.isCancel(error);
    if (canceled) {
      return Promise.reject(error);
    }

    // The OS token got an answer: let the gate learn from it (expiry → ask the OS for a fresh one;
    // refused again → fall back to this app's own login). Either way the gate is handling a 401,
    // so don't also show "request failed".
    const status = error?.response?.status;
    const handledByGate =
      Boolean(config?.__bridgeToken) && typeof status === "number" && reportBridgeResponse(config!.__bridgeToken!, status);

    if (!config?.suppressErrorToast && !handledByGate) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Request failed";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
