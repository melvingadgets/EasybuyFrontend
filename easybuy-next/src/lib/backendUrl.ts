// The EasyBuy backend the apply page and its public API routes call. Used on the server only, so a
// plain variable works (no NEXT_PUBLIC_ prefix). It defaults to the Railway service; set
// EASYBUY_BACKEND_URL to point somewhere else (for instance back at Render) without a code change.
export const BACKEND_URL = (process.env.EASYBUY_BACKEND_URL?.trim() || "https://easybuy-api-production.up.railway.app").replace(/\/+$/, "");
