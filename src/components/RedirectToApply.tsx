import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// The finance app used to carry its own copy of the EasyBuy application form. The public form now
// lives in the Apply app (easybuy-next), which has drafts, server rendering and link previews, so
// old /apply and /apply/verify links are sent there with their query string (UTM tags) intact.
// Email verification is switched off in the backend, so /apply/verify lands on the form too.
const APPLY_URL = String(import.meta.env.VITE_NEXT_APP_URL || "").replace(/\/+$/, "");

export const RedirectToApply = () => {
  const location = useLocation();

  useEffect(() => {
    if (!APPLY_URL) return;
    window.location.replace(`${APPLY_URL}/apply${location.search}`);
  }, [location.search]);

  return (
    <div className="grid min-h-screen place-items-center p-6 text-center text-sm text-muted-foreground">
      {APPLY_URL ? (
        <a href={`${APPLY_URL}/apply${location.search}`} className="underline">
          Continue to the EasyBuy application
        </a>
      ) : (
        "The EasyBuy application has moved."
      )}
    </div>
  );
};
