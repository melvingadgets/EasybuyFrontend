import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getRtkErrorMessage = (
  error: FetchBaseQueryError | SerializedError | undefined,
  fallback = "Request failed"
) => {
  if (!error) return null;

  if ("status" in error) {
    const payload = (error.data as any) || {};
    if (typeof payload?.message === "string") return payload.message;
    if (typeof payload?.error === "string") return payload.error;
    if ("error" in error && typeof error.error === "string") return error.error;
    return fallback;
  }

  if ("message" in error && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};
