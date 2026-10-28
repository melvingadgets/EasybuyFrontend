import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApplicationDocuments } from "../../components/apply/ApplicationDocuments";
import { clearDocumentsSession, loadDocumentsSession, saveDocumentsSession, type DocumentsSession } from "../../lib/documentsSession";
import { auth } from "../../lib/auth";
import { useClaimPublicEasyBuyRequestMutation } from "../../store/api/backendApi";

// The documents step, for the application this device submitted. It sits behind the login wall:
// an anonymous applicant who submits is sent to /login and comes back here, with their request
// still waiting in localStorage.
//
// On arrival the application is claimed silently — bound to the signed-in person — so it appears
// in "My applications" and the approval gate can see it. The claim is idempotent and takes no
// ownership from anyone else, so it is safe to repeat on every visit.

export const ApplyDocumentsPage = () => {
  const navigate = useNavigate();
  const [claim, { isLoading: claiming }] = useClaimPublicEasyBuyRequestMutation();

  // Read once: the session is edited below (claiming drops the token), and re-reading would
  // re-render the panel into a different credential mid-flow.
  const [session, setSession] = useState<DocumentsSession | null>(() => loadDocumentsSession());
  const [claimState, setClaimState] = useState<"idle" | "claimed" | "kept">("idle");

  // Whichever token the app is signed in with — this app's own, or the one Melvin OS handed over.
  // The backend verifies both the same way, and the documents routes accept either.
  const bearer = auth.getToken();


  useEffect(() => {
    if (!session) return;

    // Already claimed on an earlier visit: the key is gone by design (claiming consumes it), and
    // the bearer alone opens the application now. Nothing left to do.
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
        // The bearer is the more durable credential now that the request is bound to this person,
        // so the 30-day upload key is no longer needed on this device.
        const claimed = { ...session, documentsToken: undefined, claimed: true };
        saveDocumentsSession(claimed);
        setSession(claimed);
      })
      .catch((error: any) => {
        if (!active) return;
        // 409: already someone else's — this device's key is the only way in, so keep using it.
        // Anything else (offline, an older backend without the route): same fallback, so the
        // applicant is never locked out of uploading their own documents.
        setClaimState("kept");
      });

    return () => {
      active = false;
    };
    // The request id is the identity of this claim; the token never changes for one request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.requestId]);

  const auth_ = useMemo(() => ({ documentsToken: session?.documentsToken || undefined, bearer }), [session?.documentsToken, bearer]);

  if (!session) {
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
          requestId={session.requestId}
          auth={auth_}
          downPaymentNaira={session.downPaymentNaira}
          whatsAppUrl={session.whatsAppUrl}
          onSummary={({ complete }) => {
            // Remembered so "/apply" stops offering the form to someone who has finished uploading.
            // Only written when it changes, so the session isn't rewritten on every summary.
            if (complete === Boolean(session.complete)) return;
            const next = { ...session, complete };
            saveDocumentsSession(next);
            setSession(next);
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
