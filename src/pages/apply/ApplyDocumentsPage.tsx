import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ApplicationDocuments } from "../../components/apply/ApplicationDocuments";
import { clearDocumentsSession, loadDocumentsSession, saveDocumentsSession, type DocumentsSession } from "../../lib/documentsSession";
import { auth } from "../../lib/auth";
import { useClaimPublicEasyBuyRequestMutation, useGetMyApplicationsQuery } from "../../store/api/backendApi";

// The documents step, for the application this device submitted or an existing open application.
// Applicants can add, review, and update their documents anytime before approval.

export const ApplyDocumentsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paramRequestId = searchParams.get("requestId")?.trim() || "";

  const [claim, { isLoading: claiming }] = useClaimPublicEasyBuyRequestMutation();
  const [session, setSession] = useState<DocumentsSession | null>(() => loadDocumentsSession());
  const [claimState, setClaimState] = useState<"idle" | "claimed" | "kept">("idle");

  const bearer = auth.getToken();
  const { data: myAppsData, isLoading: appsLoading } = useGetMyApplicationsQuery(undefined, { skip: !auth.isLoggedIn() });
  const requests = myAppsData?.data || [];
  const openRequests = requests.filter((r) => r.status !== "approved" && r.status !== "converted");
  const targetRequest = paramRequestId ? requests.find((r) => r.requestId === paramRequestId) : openRequests[0];

  const effectiveRequestId = paramRequestId || session?.requestId || targetRequest?.requestId || "";

  useEffect(() => {
    if (!session || !session.documentsToken) return;

    if (session.claimed) {
      setClaimState("claimed");
      return;
    }

    let active = true;
    claim({ requestId: session.requestId, documentsToken: session.documentsToken })
      .unwrap()
      .then(() => {
        if (!active) return;
        setClaimState("claimed");
        const claimed = { ...session, documentsToken: undefined, claimed: true };
        saveDocumentsSession(claimed);
        setSession(claimed);
      })
      .catch(() => {
        if (!active) return;
        setClaimState("kept");
      });

    return () => {
      active = false;
    };
  }, [session?.requestId]);

  const auth_ = useMemo(
    () => ({
      documentsToken: session?.requestId === effectiveRequestId ? session?.documentsToken : undefined,
      bearer,
    }),
    [session?.requestId, session?.documentsToken, effectiveRequestId, bearer]
  );

  if (appsLoading && !effectiveRequestId) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        <ClipLoader size={16} color="currentColor" /> Loading application documents…
      </div>
    );
  }

  if (!effectiveRequestId) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6">
          <h1 className="text-xl font-semibold">No application in progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This device doesn&apos;t have a submitted application waiting for documents. If you applied on another device,
            sign in there to finish, or start a new application here.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              to="/apply/status"
              className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-base hover:bg-muted"
            >
              My applications
            </Link>
            <Link
              to="/apply/form"
              className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:opacity-90"
            >
              Apply for a device
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6">
      <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-6">
        <ApplicationDocuments
          requestId={effectiveRequestId}
          auth={auth_}
          downPaymentNaira={session?.requestId === effectiveRequestId ? session?.downPaymentNaira : undefined}
          whatsAppUrl={session?.requestId === effectiveRequestId ? session?.whatsAppUrl : undefined}
          onSummary={({ complete }) => {
            if (session?.requestId === effectiveRequestId) {
              if (complete === Boolean(session.complete)) return;
              const next = { ...session, complete };
              saveDocumentsSession(next);
              setSession(next);
            }
          }}
          onStartNew={() => {
            clearDocumentsSession();
            navigate("/apply/form");
          }}
        />
      </section>

      <p className="text-center text-sm text-muted-foreground" aria-live="polite">
        {claiming
          ? "Linking this application to your account…"
          : claimState === "claimed"
            ? "This application is on your account."
            : claimState === "kept"
              ? "Using this device's upload key for this application."
              : ""}
      </p>
    </div>
  );
};
