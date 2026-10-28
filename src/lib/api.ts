import axios from "axios";
import toast from "react-hot-toast";
import { auth } from "./auth";
import { backendBaseUrl } from "./backendBase";
import { beginGlobalLoad } from "./globalLoading";
import { isMelvinBridgeToken, reportBridgeResponse } from "./melvinBridge";
import { refreshAccessToken } from "./tokenRefresh";

type RequestMeta = {
  // Set when the request carried the Melvin OS token, so its answer can teach the bridge gate.
  __bridgeToken?: string;
  // The unified-auth token this request carried, so a 401 can try renewing exactly that one.
  __userToken?: string;
  // A retry after refreshing: a 401 now is a real refusal, not expiry.
  __retried?: boolean;
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

// One origin for the whole app, chosen in backendBase.ts (the Apply port needs it as a value too).
export const api = axios.create({
  baseURL: backendBaseUrl
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
    else meta.__userToken = token;
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
  async (error) => {
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

    // Expiry of the unified-auth access token: renew it once and replay the request with the new
    // one. Only the same request is retried, and only when the token it used is the one being
    // replaced (a stale answer for an already-replaced token is dropped).
    if (status === 401 && config?.__userToken && !config.__retried && !handledByGate) {
      const renewed = await refreshAccessToken(config.__userToken);
      if (renewed) {
        return api.request({ ...error.config, __userToken: undefined, __retried: true } as typeof error.config);
      }
    }

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
