import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import {
  useApproveSuperAdminPublicEasyBuyRequestMutation,
  useConvertSuperAdminPublicEasyBuyRequestMutation,
  useGetSuperAdminPublicEasyBuyRequestsQuery,
  useRejectSuperAdminPublicEasyBuyRequestMutation,
} from "../store/api/backendApi";
import type { PublicEasyBuyRequest } from "../types/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const parseFormattedNumber = (value: string) => {
  const sanitized = String(value || "").replace(/[^\d.]/g, "");
  const numeric = Number(sanitized);
  return Number.isFinite(numeric) ? numeric : 0;
};

const formatInputWithCommas = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return "";
  const hasTrailingDot = cleaned.endsWith(".");
  const [integerPartRaw, decimalRaw = ""] = cleaned.split(".");
  const integerPart = (integerPartRaw || "0").replace(/^0+(?=\d)/, "");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimals = decimalRaw.slice(0, 2);
  if (hasTrailingDot && !decimals.length) return `${formattedInteger}.`;
  return decimals.length ? `${formattedInteger}.${decimals}` : formattedInteger;
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const statusStyles: Record<string, string> = {
  pending_verification: "bg-amber-100 text-amber-700",
  verified: "bg-blue-100 text-blue-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
};

export const SuperAdminPublicRequestsPage = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [reasonByRequestId, setReasonByRequestId] = useState<Record<string, string>>({});
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [convertModalRequest, setConvertModalRequest] = useState<PublicEasyBuyRequest | null>(null);
  const [convertUserEmail, setConvertUserEmail] = useState("");
  const [convertPhonePrice, setConvertPhonePrice] = useState("");
  const [convertDownPayment, setConvertDownPayment] = useState("");
  const [convertMonthlyPlan, setConvertMonthlyPlan] = useState("1");
  const [convertWeeklyPlan, setConvertWeeklyPlan] = useState("4");
  const [convertReason, setConvertReason] = useState("");

  const requestsQuery = useGetSuperAdminPublicEasyBuyRequestsQuery({
    status: statusFilter || undefined,
    search: search.trim() || undefined,
    limit: 100,
    page: 1,
  });
  const [approveRequest] = useApproveSuperAdminPublicEasyBuyRequestMutation();
  const [rejectRequest] = useRejectSuperAdminPublicEasyBuyRequestMutation();
  const [convertRequest] = useConvertSuperAdminPublicEasyBuyRequestMutation();

  const loading = requestsQuery.isLoading;
  const errorMessage = getRtkErrorMessage(
    requestsQuery.error as any,
    "Failed to load public EasyBuy requests"
  );

  const requests = useMemo(() => requestsQuery.data?.data || [], [requestsQuery.data?.data]);
  const pagination = requestsQuery.data?.pagination;

  const onApprove = async (requestId: string) => {
    setActionLoadingId(requestId);
    try {
      const reason = (reasonByRequestId[requestId] || "").trim();
      const response = await approveRequest({ requestId, reason }).unwrap();
      toast.success(response.message || "Request approved");
      setReasonByRequestId((prev) => ({ ...prev, [requestId]: "" }));
    } finally {
      setActionLoadingId(null);
    }
  };

  const onReject = async (requestId: string) => {
    const reason = (reasonByRequestId[requestId] || "").trim();
    if (!reason) {
      toast.error("Reason is required to reject");
      return;
    }

    setActionLoadingId(requestId);
    try {
      const response = await rejectRequest({ requestId, reason }).unwrap();
      toast.success(response.message || "Request rejected");
      setReasonByRequestId((prev) => ({ ...prev, [requestId]: "" }));
    } finally {
      setActionLoadingId(null);
    }
  };

  const openConvertModal = (request: PublicEasyBuyRequest) => {
    setConvertModalRequest(request);
    setConvertUserEmail(request.email || "");
    setConvertPhonePrice("");
    setConvertDownPayment("");
    setConvertMonthlyPlan("1");
    setConvertWeeklyPlan("4");
    setConvertReason("");
  };

  const submitConvert = async () => {
    if (!convertModalRequest) return;
    const phonePrice = parseFormattedNumber(convertPhonePrice);
    if (!Number.isFinite(phonePrice) || phonePrice <= 0) {
      toast.error("Enter a valid phone price");
      return;
    }

    const downPayment = parseFormattedNumber(convertDownPayment);
    setActionLoadingId(convertModalRequest.requestId);
    try {
      const response = await convertRequest({
        requestId: convertModalRequest.requestId,
        userEmail: convertUserEmail.trim(),
        phonePrice,
        ...(downPayment > 0 ? { downPayment } : {}),
        ...(convertModalRequest.plan === "Monthly"
          ? { monthlyPlan: Number(convertMonthlyPlan) || 1 }
          : { weeklyPlan: Number(convertWeeklyPlan) || 4 }),
        reason: convertReason.trim(),
      }).unwrap();
      toast.success(response.message || "Request converted");
      setConvertModalRequest(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={150}>
      <section className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <h1 className="text-xl font-semibold">Public EasyBuy Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review verified requests from public traffic and approve/reject/convert as SuperAdmin.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search requestId, name, email, phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="pending_verification">pending_verification</option>
              <option value="verified">verified</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
              <option value="converted">converted</option>
            </select>
            <button
              type="button"
              onClick={() => requestsQuery.refetch()}
              className="rounded-md bg-primary px-4 py-2.5 text-sm text-primary-foreground hover:opacity-90"
            >
              Refresh
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errorMessage}</div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
          <div className="mb-3 text-xs text-muted-foreground">
            {pagination?.total !== undefined ? `Total: ${pagination.total}` : `Showing: ${requests.length}`}
          </div>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-border rounded-lg border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Request</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Customer</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Device</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Reason</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {requests.map((request) => {
                  const loadingAction = actionLoadingId === request.requestId;
                  const canReview = request.status === "verified";
                  const canConvert = request.status === "approved";
                  return (
                    <tr key={request._id}>
                      <td className="px-3 py-2 text-sm">
                        <p className="font-medium">{request.requestId}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(request.createdAt)}</p>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <p>{request.fullName}</p>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                        <p className="text-xs text-muted-foreground">{request.phone}</p>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <p>{request.iphoneModel}</p>
                        <p className="text-xs text-muted-foreground">
                          {request.capacity} • {request.plan}
                        </p>
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <span className={`rounded px-2 py-1 text-xs ${statusStyles[request.status] || "bg-muted"}`}>
                          {request.status}
                        </span>
                        {request.rejectionReason && (
                          <p className="mt-1 text-xs text-destructive">Reason: {request.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <input
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                          value={reasonByRequestId[request.requestId] || ""}
                          onChange={(event) =>
                            setReasonByRequestId((prev) => ({
                              ...prev,
                              [request.requestId]: event.target.value,
                            }))
                          }
                          placeholder="Reason (required for reject)"
                          disabled={loadingAction}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onApprove(request.requestId)}
                            disabled={!canReview || loadingAction}
                            className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(request.requestId)}
                            disabled={!canReview || loadingAction}
                            className="rounded-md bg-destructive px-3 py-1.5 text-xs text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => openConvertModal(request)}
                            disabled={!canConvert || loadingAction}
                            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-60"
                          >
                            Convert
                          </button>
                          {loadingAction && (
                            <ClipLoader color="hsl(var(--primary))" size={14} speedMultiplier={0.9} />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {requests.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={6}>
                      No public requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {convertModalRequest && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(event) => {
            if (event.target === event.currentTarget && actionLoadingId !== convertModalRequest.requestId) {
              setConvertModalRequest(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm md:items-center"
        >
          <article className="w-full max-w-xl rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft">
            <h2 className="text-lg font-semibold">Convert Request</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {convertModalRequest.requestId} • {convertModalRequest.iphoneModel} ({convertModalRequest.capacity})
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase text-muted-foreground">User Email (existing user)</label>
                <input
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={convertUserEmail}
                  onChange={(e) => setConvertUserEmail(e.target.value)}
                  disabled={actionLoadingId === convertModalRequest.requestId}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-muted-foreground">Phone Price (NGN)</label>
                <input
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={convertPhonePrice}
                  onChange={(e) => setConvertPhonePrice(formatInputWithCommas(e.target.value))}
                  placeholder="e.g. 1,250,000"
                  disabled={actionLoadingId === convertModalRequest.requestId}
                />
                <p className="text-xs text-muted-foreground">
                  Parsed: {formatCurrency(parseFormattedNumber(convertPhonePrice))}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-muted-foreground">Down Payment (optional)</label>
                <input
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={convertDownPayment}
                  onChange={(e) => setConvertDownPayment(formatInputWithCommas(e.target.value))}
                  placeholder="leave empty for minimum"
                  disabled={actionLoadingId === convertModalRequest.requestId}
                />
              </div>

              {convertModalRequest.plan === "Monthly" ? (
                <div className="space-y-2">
                  <label className="text-xs uppercase text-muted-foreground">Monthly Plan</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={convertMonthlyPlan}
                    onChange={(e) => setConvertMonthlyPlan(e.target.value)}
                    disabled={actionLoadingId === convertModalRequest.requestId}
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs uppercase text-muted-foreground">Weekly Plan</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={convertWeeklyPlan}
                    onChange={(e) => setConvertWeeklyPlan(e.target.value)}
                    disabled={actionLoadingId === convertModalRequest.requestId}
                  >
                    <option value="4">4 Weeks</option>
                    <option value="8">8 Weeks</option>
                    <option value="12">12 Weeks</option>
                  </select>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs uppercase text-muted-foreground">Reason (optional)</label>
                <input
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={convertReason}
                  onChange={(e) => setConvertReason(e.target.value)}
                  disabled={actionLoadingId === convertModalRequest.requestId}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConvertModalRequest(null)}
                disabled={actionLoadingId === convertModalRequest.requestId}
                className="rounded-md border border-border bg-background px-3 py-2 text-xs hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitConvert}
                disabled={actionLoadingId === convertModalRequest.requestId}
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {actionLoadingId === convertModalRequest.requestId ? (
                  <>
                    <ClipLoader color="hsl(var(--primary-foreground))" size={14} speedMultiplier={0.9} />
                    Converting...
                  </>
                ) : (
                  "Convert Request"
                )}
              </button>
            </div>
          </article>
        </div>
      )}
    </BlurLoadingContainer>
  );
};
