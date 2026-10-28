// Where the unified auth service lives (Shortwork/AGENTS.md §1.4: identity belongs to auth).
//
// Every person on the platform has one account there; this app signs people in against it and
// then presents the RS256 user token it returns. The EasyBuy backend verifies that token against
// auth's JWKS, and it is the only token the Apply routes accept (an `/mine` token, not our own).
//
// Unset in local development on purpose: `http://localhost:5500`, where `npm run dev` in
// unified-auth-service listens. Production sets VITE_AUTH_BASE_URL on Vercel.

const raw = String(
  import.meta.env.VITE_AUTH_BASE_URL || "https://unified-auth-production.up.railway.app"
).trim();

export const authBaseUrl = (raw || "https://unified-auth-production.up.railway.app").replace(/\/+$/, "");

export const authUrl = (path: string): string =>
  `${authBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
