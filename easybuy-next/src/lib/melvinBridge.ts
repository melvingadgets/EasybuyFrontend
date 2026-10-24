"use client";

export type MelvinOutboundType =
  | "melvin:hello"
  | "melvin:ready"
  | "melvin:token-expired";

type MelvinInboundType = "melvin:auth" | "melvin:logout";

export interface MelvinBridgeUser {
  _id: string;
  email: string | null;
  fullName: string;
  role: "User" | "Admin" | "SuperAdmin";
}

const MELVIN_OS_ORIGINS = String(process.env.NEXT_PUBLIC_MELVIN_OS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const isEmbeddedInMelvin = (): boolean => {
  if (typeof window === "undefined" || window.parent === window) return false;
  return new URLSearchParams(window.location.search).get("embed") === "melvin";
};

export const postToMelvin = (type: MelvinOutboundType) => {
  if (!isEmbeddedInMelvin()) return;

  // A non-matching targetOrigin is silently dropped, so only Melvin OS hosts receive it.
  for (const origin of MELVIN_OS_ORIGINS) {
    window.parent.postMessage({ type, version: 1 }, origin);
  }
};

export const notifyMelvinTokenExpired = () => postToMelvin("melvin:token-expired");

// ── Token hand-off (INTEGRATION-PLAN §12.3) ─────────────────────────────────
// Apply is public, but it still accepts the OS session so authenticated prefill
// works when the user is signed in. The token is held in memory only.
let bridgeToken: string | null = null;
let bridgeUser: MelvinBridgeUser | null = null;
let bridgeStarted = false;

const listeners = new Set<() => void>();

const emitAuthChange = (): void => {
  for (const listener of listeners) listener();
};

export const getMelvinBridgeToken = (): string | null => bridgeToken;
export const getMelvinBridgeUser = (): MelvinBridgeUser | null => bridgeUser;

export const onMelvinAuthChange = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const startMelvinAuthBridge = (): void => {
  if (typeof window === "undefined" || !isEmbeddedInMelvin() || bridgeStarted) return;
  bridgeStarted = true;

  window.addEventListener("message", (event: MessageEvent) => {
    if (!MELVIN_OS_ORIGINS.includes(event.origin)) return;
    if (event.source !== window.parent) return;

    const data = event.data as { type?: MelvinInboundType; token?: unknown; user?: unknown } | null;
    if (!data || typeof data !== "object") return;

    if (data.type === "melvin:auth") {
      bridgeToken = typeof data.token === "string" ? data.token : null;
      bridgeUser = (data.user as MelvinBridgeUser | null) ?? null;
      emitAuthChange();
    } else if (data.type === "melvin:logout") {
      bridgeToken = null;
      bridgeUser = null;
      emitAuthChange();
    }
  });
};
