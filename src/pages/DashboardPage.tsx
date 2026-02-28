import { useEffect, useMemo, useState } from "react";
import { FaCreditCard, FaTimes, FaUniversity, FaWallet } from "react-icons/fa";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useGetCurrentUserQuery, useGetDashboardQuery } from "../store/api/backendApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const formatDate = (value: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusStyles: Record<"paid" | "pending" | "approved" | "failed", string> = {
  paid: "bg-success/15 text-success",
  approved: "bg-success/15 text-success",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-destructive/10 text-destructive",
};

const planStyles: Record<"active" | "completed" | "cancelled", string> = {
  active: "bg-primary/15 text-primary",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const paymentAccounts = [
  {
    accountName: "Aurapay Nigeria Ltd",
    bank: "Opay",
    accountNumber: "6141695754",
  },
  {
    accountName: "Aurapay Ltd",
    bank: "GTBANK",
    accountNumber: "9007092282",
  },
];

export const DashboardPage = () => {
  const [showPaymentAccountsModal, setShowPaymentAccountsModal] = useState(false);

  const dashboardQuery = useGetDashboardQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const currentUserQuery = useGetCurrentUserQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const loading = dashboardQuery.isLoading || currentUserQuery.isLoading;
  const errorMessage = getRtkErrorMessage(
    (dashboardQuery.error || currentUserQuery.error) as any,
    "Failed to load dashboard"
  );

  const profileName = useMemo(() => {
    const profile = (currentUserQuery.data?.data || {}) as any;
    const resolvedName = String(profile.FullName || profile.fullName || profile.userName || "USER").trim();
    return resolvedName || "USER";
  }, [currentUserQuery.data?.data]);

  const paidProgress = useMemo(() => {
    const totalAmount = (dashboardQuery.data?.totalPaid || 0) + (dashboardQuery.data?.remainingBalance || 0);
    const totalPaid = dashboardQuery.data?.totalPaid || 0;
    if (totalAmount <= 0) return 0;
    return Math.max(0, Math.min((totalPaid / totalAmount) * 100, 100));
  }, [dashboardQuery.data?.remainingBalance, dashboardQuery.data?.totalPaid]);

  const progressWidth = useMemo(() => `${paidProgress}%`, [paidProgress]);

  const avatarInitials = useMemo(() => {
    const parts = profileName.split(/\s+/).filter(Boolean);
    if (!parts.length) return "U";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
  }, [profileName]);

  useEffect(() => {
    if (!showPaymentAccountsModal) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPaymentAccountsModal(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [showPaymentAccountsModal]);

  if (errorMessage && !loading) {
    return (
      <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h1 className="text-2xl font-semibold">EasyBuy Dashboard</h1>
        <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</p>
        <button
          type="button"
          onClick={() => {
            dashboardQuery.refetch();
            currentUserQuery.refetch();
          }}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </section>
    );
  }

  const dashboard = dashboardQuery.data || {
    totalAmount: 0,
    totalPaid: 0,
    remainingBalance: 0,
    owedAmount: 0,
    progress: 0,
    nextPaymentDue: null,
    nextPaymentAmount: 0,
    planStatus: "cancelled" as const,
    recentPayments: [],
  };

  const owedAmount = Math.max(Number(dashboard.owedAmount || 0), 0);

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={150}>
      <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">EasyBuy Payment Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Clear view of agreement, payments, and balance.</p>
            <p className="mt-2 text-sm font-medium text-primary">Welcome, {profileName.toUpperCase()}</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sidebar-primary text-base font-bold text-primary-foreground shadow-soft">
            {avatarInitials}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Phone Price</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(dashboard.totalAmount)}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Paid</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(dashboard.totalPaid)}</p>
          </article>
          <article className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Remaining Balance</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(dashboard.remainingBalance)}</p>
          </article>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FaWallet className="text-primary" />
            <h2 className="text-lg font-semibold">Payment Action Center</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${planStyles[dashboard.planStatus]}`}>
              {dashboard.planStatus}
            </span>
            <button
              type="button"
              onClick={() => setShowPaymentAccountsModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <FaWallet className="text-[11px]" />
              Make Payment
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {owedAmount > 0 && (
            <div className="rounded-lg border border-border bg-muted p-4">
              <p className="text-xs uppercase text-muted-foreground">Amount Owed</p>
              <p className="mt-2 text-lg font-semibold text-destructive">{formatCurrency(owedAmount)}</p>
              <p className="mt-1 text-xs text-muted-foreground">From unresolved due payments only</p>
            </div>
          )}
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs uppercase text-muted-foreground">Amount Due Till Next Date</p>
            <p className="mt-2 text-lg font-semibold text-primary">{formatCurrency(dashboard.nextPaymentAmount)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Installment expected by next due date</p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-4">
            <p className="text-xs uppercase text-muted-foreground">Due Date</p>
            <p className="mt-2 text-lg font-semibold">{formatDate(dashboard.nextPaymentDue)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Progress</h2>
          <span className="text-sm font-medium text-muted-foreground">{paidProgress.toFixed(2)}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: progressWidth }} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h2 className="text-lg font-semibold">Recent Payments</h2>
        {dashboard.recentPayments.length === 0 ? (
          <p className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">No payments recorded yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {dashboard.recentPayments.map((payment, index) => (
              <li
                key={`${payment.paidAt}-${index}`}
                className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold">{formatCurrency(payment.amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-card px-2 py-1 text-xs text-muted-foreground">
                    {payment.paymentMethod}
                  </span>
                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${statusStyles[payment.status]}`}>
                    {payment.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </section>

      {showPaymentAccountsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment accounts"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowPaymentAccountsModal(false);
            }
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
        >
          <article className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft">
            <header className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FaWallet className="text-primary" />
                <h3 className="text-lg font-semibold">Payment Accounts</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentAccountsModal(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted"
              >
                <FaTimes />
              </button>
            </header>

            <div className="mt-4 space-y-3">
              {paymentAccounts.map((account) => (
                <article
                  key={`full-${account.bank}-${account.accountNumber}`}
                  className="rounded-lg border border-border bg-muted p-4"
                >
                  <p className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                    <FaUniversity />
                    {account.bank}
                  </p>
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Account Name:</span> {account.accountName}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm">
                    <FaCreditCard className="text-muted-foreground" />
                    <span>
                      <span className="font-medium">Account Number:</span> {account.accountNumber}
                    </span>
                  </p>
                </article>
              ))}
            </div>
          </article>
        </div>
      )}
    </BlurLoadingContainer>
  );
};
