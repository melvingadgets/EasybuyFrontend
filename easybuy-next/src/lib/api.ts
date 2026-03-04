"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { beginGlobalLoad } from "@/lib/globalLoading";

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
const shouldSuppressBackgroundEmailToast = (message: string): boolean => {
  const normalized = String(message || "").toLowerCase();
  return (
    normalized.includes("verification email") ||
    normalized.includes("email could not be sent") ||
    normalized.includes("email is currently disabled") ||
    normalized.includes("email verification is currently disabled")
  );
};

const API_MODE = String(process.env.NEXT_PUBLIC_API_MODE || "online").trim().toLowerCase();
const LOCAL_API_URL = String(process.env.NEXT_PUBLIC_API_LOCAL_URL || "http://localhost:552").trim();
const ONLINE_API_URL = String(
  process.env.NEXT_PUBLIC_API_ONLINE_URL || "https://easybuytrackerbackend.onrender.com"
).trim();
const LEGACY_BASE_URL = String(process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();

const baseURL =
  API_MODE === "local"
    ? LOCAL_API_URL || ONLINE_API_URL || LEGACY_BASE_URL || "http://localhost:552"
    : ONLINE_API_URL || LEGACY_BASE_URL || LOCAL_API_URL || "https://easybuytrackerbackend.onrender.com";

export const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const meta = config as typeof config & RequestMeta;
  if (!meta.suppressGlobalLoader) {
    meta.__stopGlobalLoad = beginGlobalLoad();
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

      if (!shouldSuppressBackgroundEmailToast(message)) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  }
);


