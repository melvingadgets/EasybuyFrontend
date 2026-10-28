import { useState } from "react";
import { Link } from "react-router-dom";
import { ApplicationDocuments } from "./ApplicationDocuments";
import { OPEN_STATUSES, statusStyle } from "./applicationStatus";
import { auth } from "../../lib/auth";
import { isMelvinBridgeToken } from "../../lib/melvinBridge";
import { useGetMyApplicationsQuery } from "../../store/api/backendApi";

// "My applications": where each of the signed-in person's EasyBuy applications stands, with the
// documents panel for the ones still open. Hidden entirely for anonymous visitors (the route is
// signed-in only, so the query 401s and we render nothing) and compact when folded into the form.

type Props = {
  /** The status page keeps its own heading and empty state; the form just wants the list. */
  showWhenEmpty?: boolean;
};

export function MyApplications({ showWhenEmpty = false }: Props) {
  const [openDocuments, setOpenDocuments] = useState<string | null>(null);
  const signedIn = auth.isLoggedIn();
  const { data, isLoading } = useGetMyApplicationsQuery(undefined, { skip: !signedIn });

  const requests = data?.data || [];

  // Documents accept our own token; the Melvin OS token is only good while the OS session is live,
  // so it is passed as the bearer too — both are the same credential the backend already trusts.
  const token = auth.getToken();
  const bearer = token && !isMelvinBridgeToken(token) ? token : null;

  if (!signedIn) return null;

  if (isLoading && !requests.length) {
    return <p className="mb-5 text-sm text-muted-foreground">Loading your applications…</p>;
  }

  if (!requests.length) {
    if (!showWhenEmpty) return null;
    return (
      <div className="rounded-xl border border-border bg-muted p-4 text-sm">
        <p className="font-medium">No applications yet.</p>
        <p className="mt-1 text-muted-foreground">
          <Link to="/apply/form" className="font-medium text-primary underline underline-offset-2">
            Apply for a device
          </Link>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <section className="mb-5 rounded-xl border border-border bg-muted p-4">
      <h2 className="text-lg font-semibold">My applications</h2>
      <ul className="mt-3 space-y-2">
        {requests.map((request) => {
          const status = statusStyle(request.status);
          return (
            <li key={request.requestId} className="rounded-lg bg-background px-3 py-2.5">
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {request.iphoneModel} ({request.capacity}) · {request.plan}
                  </span>
                  <span className="block text-xs text-muted-foreground">{request.requestId}</span>
                </span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.tone}`}>{status.label}</span>
              </div>

              {OPEN_STATUSES.has(request.status) ? (
                <button
                  type="button"
                  aria-expanded={openDocuments === request.requestId}
                  onClick={() => setOpenDocuments((current) => (current === request.requestId ? null : request.requestId))}
                  className="mt-2 min-h-11 w-full rounded-md border border-border px-3 text-sm font-medium hover:bg-muted"
                >
                  {openDocuments === request.requestId ? "Hide documents" : "Documents: bank statement, NIN, photo"}
                </button>
              ) : null}

              {openDocuments === request.requestId ? (
                <div className="mt-3">
                  <ApplicationDocuments requestId={request.requestId} auth={{ bearer }} compact />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
