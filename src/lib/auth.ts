import { getMelvinBridgeToken, isEmbeddedInMelvin } from "./melvinBridge";

const TOKEN_KEY = "easybuytracker_token";
const SESSION_TOKEN_KEY = "easybuytracker_session_token";
const LEGACY_SESSION_TOKEN_KEY = "easybuytracker_sessiontoken";
type UserRole = "Admin" | "User" | "SuperAdmin" | null;

// Inside Melvin OS the session comes from the bridge and lives in memory only.
// Everywhere else it's the app's own token in localStorage.
const currentToken = (): string | null => {
  if (isEmbeddedInMelvin) {
    const bridged = getMelvinBridgeToken();
    if (bridged) return bridged;
  }
  return localStorage.getItem(TOKEN_KEY);
};

// Never evict the bridge token from localStorage — it was never stored there.
const forgetStoredToken = (): void => {
  if (isEmbeddedInMelvin && getMelvinBridgeToken()) return;
  localStorage.removeItem(TOKEN_KEY);
};

type JwtPayload = {
  role?: "Admin" | "User" | "SuperAdmin";
  exp?: number;
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(normalized));
    return payload;
  } catch {
    return null;
  }
};

const isTokenExpired = (payload: JwtPayload | null): boolean => {
  if (!payload?.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds;
};

export const auth = {
  getToken: () => currentToken(),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem(LEGACY_SESSION_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_TOKEN_KEY);
  },
  isLoggedIn: () => {
    const token = currentToken();
    if (!token) return false;
    const payload = parseJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      forgetStoredToken();
      return false;
    }
    return true;
  },
  getRole: (): UserRole => {
    const token = currentToken();
    if (!token) return null;
    const payload = parseJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      forgetStoredToken();
      return null;
    }
    return payload?.role || null;
  }
};
