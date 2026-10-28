import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { auth } from "../lib/auth";
import { decideApplicationAccess } from "../lib/applicationAccess";
import { statusStyle } from "./apply/applicationStatus";
import { useGetEasyBoughtItemsQuery, useGetMyApplicationsQuery } from "../store/api/backendApi";

// The approval gate (plan §"The two gates", part 2).
//
// The finance screens only make sense once EasyBuy has converted an application into a financed
// item. Until then, a customer who signs in would land on a dashboard of zeros — which is
// indistinguishable from a loan that's fully paid off. So the gate reads where they actually are
// and sends them somewhere honest:
//
//   no applications            → /apply, to start one
//   received / under review    → /apply/status, where documents can still be added
//   rejected                   → /apply/status, with the reason and a re-apply link
//   approved                   → the "activating" screen below (no loan numbers yet)
//   converted with an item     → the real screens, unchanged
//   converted without an item  → /apply/status, "contact support" (never an empty dashboard)
//
// Admin and SuperAdmin are staff, not customers: they pass straight through.
//
// It wraps the finance screens inside ProtectedRoute, so the person is authenticated already.

const ActivatingScreen = ({ model, capacity, plan, requestId }: { model: string; capacity: string; plan: string; requestId: string }) => {
  const style = statusStyle("approved");
  return (
    <section className="mx-auto w-full max-w-2xl space-y-6 px-4 py-10 md:px-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${style.tone}`}>Approved</span>
        <h1 className="mt-3 text-2xl font-semibold">You&apos;re approved</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;re setting up your account for the {model} ({capacity}) on the {plan} plan. Your dashboard with the payment
          schedule appears here as soon as it&apos;s ready.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Request {requestId}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/apply/status"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-4 text-base hover:bg-muted"
          >
            View my applications
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h2 className="text-lg font-semibold">What happens next</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1.</span> Melvin Gadgets calls you to confirm the phone and arrange
            collection.
          </li>
          <li>
            <span className="font-medium text-foreground">2.</span> You pay your down payment and the service charge when you
            collect.
          </li>
          <li>
            <span className="font-medium text-foreground">3.</span> Your repayment schedule appears on your dashboard.
          </li>
        </ol>
      </div>

      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
        Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the phone.
      </p>
    </section>
  );
};

export const ApprovedOnlyRoute = () => {
  const location = useLocation();
  const role = auth.getRole();

  const staff = role === "Admin" || role === "SuperAdmin";

  const applicationsQuery = useGetMyApplicationsQuery(undefined, { skip: staff });
  const itemsQuery = useGetEasyBoughtItemsQuery(undefined, { skip: staff });

  if (staff) return <Outlet />;

  // Wait for both answers: redirecting on a half-loaded view would bounce a customer with a
  // perfectly good loan to /apply on every slow connection.
  if (applicationsQuery.isLoading || itemsQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 text-center text-sm text-muted-foreground md:px-6" role="status">
        Checking your account…
      </div>
    );
  }

  const requests = applicationsQuery.data?.data || [];
  const hasItems = (itemsQuery.data?.data || []).length > 0;
  const decision = decideApplicationAccess(requests, hasItems);

  switch (decision.kind) {
    case "open":
      return <Outlet />;

    case "activating":
      // The dashboard is where "approved" gets its own screen; the other finance routes have
      // nothing to show without a loan, so they go to the status page instead.
      return location.pathname === "/dashboard" ? (
        <ActivatingScreen
          model={decision.request.iphoneModel}
          capacity={decision.request.capacity}
          plan={decision.request.plan}
          requestId={decision.request.requestId}
        />
      ) : (
        <Navigate to="/apply/status" replace />
      );

    case "no_applications":
      // Nothing to gate yet: start an application. `replace` so Back doesn't bounce.
      return <Navigate to="/apply" replace />;

    case "under_review":
    case "rejected":
    case "converted_unlinked":
    default:
      return <Navigate to="/apply/status" replace />;
  }
};
