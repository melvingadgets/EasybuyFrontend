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

// In production, all client-side calls go to same-origin Next.js API routes
// which proxy to the backend server-side. This prevents in-app browsers
// (Snapchat, Instagram, TikTok) from blocking cross-origin requests.
const baseURL = API_MODE === "local" ? LOCAL_API_URL : "";

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


