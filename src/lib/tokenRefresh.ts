import { auth } from "./auth";
import { authUrl } from "./authBase";
import { getMelvinBridgeToken, isEmbeddedInMelvin } from "./melvinBridge";

// Keeps a signed-in person's access token fresh. The unified auth service issues a 15-minute
// RS256 access token plus a long-lived refresh token; refreshing rotates the refresh token, so the
// old one stops working. Two consequences shape this file:
//   - refresh is attempted ONCE per token, and concurrent 401s share one in-flight request (a
//     second refresh with the already-rotated token would revoke the session upstream);
//   - when it fails, the session is cleared, so every guard falls back to /login.

type RefreshResponse = {
  accessToken?: string;
  refreshToken?: string;
};

let inFlight: Promise<boolean> | null = null;
// The token whose refresh already failed: don't hammer auth on every request afterwards.
let refusedFor: string | null = null;

const postRefresh = async (refreshToken: string): Promise<RefreshResponse | null> => {
  try {
    const response = await fetch(authUrl("/api/v1/auth/token/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    return (await response.json()) as RefreshResponse;
  } catch {
    return null;
  }
};

/**
 * Tries to renew the access token that was rejected. Returns true when a new token is stored and
 * the caller should retry. The Melvin OS token is never refreshed here: it belongs to the OS,
 * which is asked for a fresh one through the bridge instead.
 */
export const refreshAccessToken = async (rejectedToken: string | null | undefined): Promise<boolean> => {
  if (isEmbeddedInMelvin && getMelvinBridgeToken()) return false;
  if (inFlight) return inFlight;
  // A late 401 for a token that has already been replaced says nothing about the current one.
  const stored = auth.getToken();
  if (!rejectedToken || rejectedToken !== stored) return false;
  if (refusedFor === rejectedToken) return false;

  const refreshToken = auth.getRefreshToken();
  if (!refreshToken) return false;

  inFlight = (async () => {
    const refreshed = await postRefresh(refreshToken);
    if (!refreshed?.accessToken) {
      refusedFor = rejectedToken;
      auth.clearToken();
      return false;
    }
    auth.replaceTokens({ accessToken: refreshed.accessToken, refreshToken: refreshed.refreshToken });
    refusedFor = null;
    return true;
  })().finally(() => {
    inFlight = null;
  });

  return inFlight;
};
