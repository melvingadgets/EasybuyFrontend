import { Link } from "react-router-dom";
import { MyApplications } from "../../components/apply/MyApplications";
import { statusStyle } from "../../components/apply/applicationStatus";
import { useGetMyApplicationsQuery } from "../../store/api/backendApi";
import type { MyEasyBuyApplication } from "../../types/api";

// "Where is my application?" — the page the gate sends people to while they wait, and the one
// linked from the nav. It answers in the applicant's words: what state the request is in, what to
// do next, and why it wasn't approved when that's the answer.

// The most advanced application decides what the page says at the top. `converted` outranks
// `approved`, which outranks a rejection — someone with an old rejected request and a live one
// should not be told they were turned down.
const PRIORITY: Record<MyEasyBuyApplication["status"], number> = {
  converted: 5,
  approved: 4,
  verified: 3,
  pending_verification: 2,
  rejected: 1,
};

const latestByPriority = (requests: MyEasyBuyApplication[]) =>
  [...requests].sort((a, b) => (PRIORITY[b.status] || 0) - (PRIORITY[a.status] || 0))[0] || null;

export const ApplyStatusPage = () => {
  const { data, isLoading } = useGetMyApplicationsQuery();
  const requests = data?.data || [];
  const latest = latestByPriority(requests);
  const style = statusStyle(latest?.status);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6">
      <header>
        <h1 className="text-2xl font-semibold">My applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your EasyBuy applications and add any documents Melvin Gadgets still needs.
        </p>
      </header>

      {isLoading ? <p className="text-sm text-muted-foreground">Loading your applications…</p> : null}

      {latest ? (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${style.tone}`}>{style.label}</span>
          <p className="mt-3 text-lg font-semibold">
            {latest.iphoneModel} ({latest.capacity}) · {latest.plan}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{style.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">Request {latest.requestId}</p>

          {latest.status === "converted" ? (
            <Link
              to="/dashboard"
              className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:opacity-90"
            >
              Go to your dashboard
            </Link>
          ) : null}

          {latest.status === "rejected" ? (
            <Link
              to="/apply/form"
              className="mt-4 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground hover:opacity-90"
            >
              Apply again
            </Link>
          ) : null}
        </section>
      ) : null}

      {!isLoading ? <MyApplications showWhenEmpty /> : null}

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-lg font-semibold">How it works</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <span className="font-medium text-foreground">1. Apply.</span> Pick a device and a plan, no account needed.
          </li>
          <li>
            <span className="font-medium text-foreground">2. Add your documents.</span> Last 3 months&apos; bank statement
            (with your down payment already in the account), your NIN, and a photo of you holding your NIN.
          </li>
          <li>
            <span className="font-medium text-foreground">3. We review.</span> Melvin Gadgets calls you to confirm the phone
            and collect.
          </li>
        </ol>
      </section>

      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-800">
        Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the phone.
      </p>
    </div>
  );
};
