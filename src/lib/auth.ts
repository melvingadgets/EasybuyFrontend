const TOKEN_KEY = "easybuytracker_token";
type UserRole = "Admin" | "User" | null;

type JwtPayload = {
  role?: "Admin" | "User";
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
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    const payload = parseJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    return true;
  },
  getRole: (): UserRole => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const payload = parseJwtPayload(token);
    if (!payload || isTokenExpired(payload)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return payload?.role || null;
  }
};
