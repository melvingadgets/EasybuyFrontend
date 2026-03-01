import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { api } from "../lib/api";

type VerifyState = "loading" | "success" | "error";

export const PublicEasyBuyVerifyPage = () => {
  const [params] = useSearchParams();
  const token = useMemo(() => String(params.get("token") || "").trim(), [params]);

  const [state, setState] = useState<VerifyState>("loading");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openingWhatsApp, setOpeningWhatsApp] = useState(false);

  useEffect(() => {
    let active = true;

    const verify = async () => {
      if (!token) {
        if (!active) return;
        setState("error");
        setErrorMessage("Verification token is missing.");
        return;
      }

      setState("loading");
      try {
        const response = await api.get("/api/v1/public/easybuy-requests/verify", {
          params: { token },
          suppressErrorToast: false,
        } as any);
        if (!active) return;

        setWhatsappUrl(String(response?.data?.data?.whatsappUrl || ""));
        setState("success");
        toast.success(response?.data?.message || "Email verified successfully");
      } catch (error: any) {
        if (!active) return;
        setState("error");
        setErrorMessage(
          String(error?.response?.data?.message || "Verification failed. Request a new verification email.")
        );
      }
    };

    verify();
    return () => {
      active = false;
    };
  }, [token]);

  const openContactAdminWhatsApp = () => {
    if (!whatsappUrl || openingWhatsApp) return;
    setOpeningWhatsApp(true);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setOpeningWhatsApp(false), 600);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 md:px-6">
      <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <ClipLoader color="hsl(var(--primary))" size={28} speedMultiplier={0.9} />
            <p className="text-sm text-muted-foreground">Verifying your email...</p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Email verified</h1>
            <p className="text-sm text-muted-foreground">
              Your EasyBuy request is now verified and ready for SuperAdmin review.
            </p>
            {whatsappUrl && (
              <button
                type="button"
                onClick={openContactAdminWhatsApp}
                disabled={openingWhatsApp}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {openingWhatsApp ? (
                  <>
                    <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                    Opening WhatsApp...
                  </>
                ) : (
                  "Contact Admin on WhatsApp"
                )}
              </button>
            )}
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Verification failed</h1>
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</p>
            <Link
              to="/apply"
              className="inline-flex rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
            >
              Back to request form
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};
