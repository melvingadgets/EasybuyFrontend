"use client";

export type MelvinBridgeMessageType = "melvin:hello" | "melvin:ready";

const MELVIN_OS_ORIGINS = String(process.env.NEXT_PUBLIC_MELVIN_OS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isEmbeddedInMelvin = (): boolean => {
  if (typeof window === "undefined" || window.parent === window) return false;
  return new URLSearchParams(window.location.search).get("embed") === "melvin";
};

export const postToMelvin = (type: MelvinBridgeMessageType) => {
  if (!isEmbeddedInMelvin()) return;

  // A non-matching targetOrigin is silently dropped, so only Melvin OS hosts receive it.
  for (const origin of MELVIN_OS_ORIGINS) {
    window.parent.postMessage({ type, version: 1 }, origin);
  }
};
