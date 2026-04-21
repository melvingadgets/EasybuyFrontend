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

// All client-side calls go through same-origin Next.js API proxy routes,
// which forward to the backend server-side. This prevents in-app browsers
// (Snapchat, Instagram, TikTok) from blocking cross-origin requests.
export const api = axios.create({
  baseURL: "",
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


