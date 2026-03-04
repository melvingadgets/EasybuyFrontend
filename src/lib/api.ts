import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "./auth";
import { beginGlobalLoad } from "./globalLoading";

type RequestMeta = {
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
  import.meta.env.VITE_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com"
).trim();
const onlineFallbackUrl = "https://easybuytrackerbackend.onrender.com";

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
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    stopGlobalLoad(response.config as RequestMeta);
    return response;
  },
  (error) => {
    const config = (error?.config || undefined) as RequestMeta | undefined;
    stopGlobalLoad(config);

    const canceled = error?.code === "ERR_CANCELED" || axios.isCancel(error);
    if (canceled) {
      return Promise.reject(error);
    }

    if (!config?.suppressErrorToast) {
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
