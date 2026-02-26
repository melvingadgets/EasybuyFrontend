import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useApproveReceiptMutation, useGetPendingReceiptsQuery } from "../store/api/backendApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const formatDateTime = (value: string | undefined) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

export const AdminReceiptApprovalsPage = () => {
  const pendingReceiptsQuery = useGetPendingReceiptsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [approveReceipt] = useApproveReceiptMutation();

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [reasonByReceiptId, setReasonByReceiptId] = useState<Record<string, string>>({});
  const [hiddenReceiptIds, setHiddenReceiptIds] = useState<Record<string, boolean>>({});
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  const pendingReceipts = useMemo(() => pendingReceiptsQuery.data?.data || [], [pendingReceiptsQuery.data?.data]);

  const receipts = useMemo(
    () => pendingReceipts.filter((receipt) => !hiddenReceiptIds[receipt._id]),
    [hiddenReceiptIds, pendingReceipts]
  );
  const selectedReceipt = useMemo(
    () => pendingReceipts.find((receipt) => receipt._id === selectedReceiptId) || null,
    [pendingReceipts, selectedReceiptId]
  );

  const pageLoading = pendingReceiptsQuery.isLoading;
  const pageError = getRtkErrorMessage(
    pendingReceiptsQuery.error as any,
    "Failed to load pending receipts"
  );

  useEffect(() => {
    if (selectedReceiptId && !selectedReceipt) {
      setSelectedReceiptId(null);
    }
  }, [selectedReceipt, selectedReceiptId]);

  useEffect(() => {
    if (!selectedReceiptId) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedReceiptId(null);
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [selectedReceiptId]);

  const approve = async (receiptId: string) => {
    setApprovingId(receiptId);
    try {
      const reason = (reasonByReceiptId[receiptId] || "").trim();
      const response = await approveReceipt({ receiptId, reason }).unwrap();
      toast.success(response?.message || "Payment approved");
      setReasonByReceiptId((prev) => ({ ...prev, [receiptId]: "" }));
      setHiddenReceiptIds((prev) => ({ ...prev, [receiptId]: true }));
      setSelectedReceiptId((current) => (current === receiptId ? null : current));
    } catch (error: any) {
      if (error?.status === 409) {
        setHiddenReceiptIds((prev) => ({ ...prev, [receiptId]: true }));
        setSelectedReceiptId((current) => (current === receiptId ? null : current));
        pendingReceiptsQuery.refetch();
      }
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <BlurLoadingContainer loading={pageLoading} minDurationMs={150}>
      <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h1 className="text-xl font-semibold">Receipt Approvals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          SuperAdmin-only approvals for pending receipt-backed payments.
        </p>

        {pageError && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <span>{pageError}</span>
            <button
              type="button"
              onClick={() => pendingReceiptsQuery.refetch()}
              className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-4 w-full max-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border rounded-lg border border-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">User</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Receipt</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Reason</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {receipts.map((receipt) => (
                <tr key={receipt._id}>
                  <td className="px-3 py-2 text-sm">{receipt.user?.fullName || "-"}</td>
                  <td className="px-3 py-2 text-sm">{receipt.user?.email || "-"}</td>
                  <td className="px-3 py-2 text-sm">{formatCurrency(receipt.amount)}</td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptId(receipt._id)}
                      className="text-primary hover:underline"
                    >
                      View details
                    </button>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <input
                      type="text"
                      value={reasonByReceiptId[receipt._id] || ""}
                      onChange={(event) =>
                        setReasonByReceiptId((prev) => ({
                          ...prev,
                          [receipt._id]: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Optional audit reason"
                      disabled={approvingId === receipt._id}
                    />
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      type="button"
                      onClick={() => approve(receipt._id)}
                      disabled={approvingId === receipt._id}
                      className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {approvingId === receipt._id ? (
                        <>
                          <ClipLoader color="hsl(var(--primary-foreground))" size={14} speedMultiplier={0.9} />
                          Approving...
                        </>
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={6}>
                    No pending receipts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Receipt details"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedReceiptId(null);
            }
          }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
        >
          <article className="mt-[120px] max-h-[90dvh] w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-soft">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold">Receipt Details</h2>
              <button
                type="button"
                onClick={() => setSelectedReceiptId(null)}
                className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Close
              </button>
            </header>

            <div className="max-h-[calc(90dvh-70px)] space-y-5 overflow-y-auto p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-xs uppercase text-muted-foreground">Submitted By</p>
                  <p className="mt-1 text-sm font-medium">{selectedReceipt.user?.fullName || "-"}</p>
                  <p className="text-xs text-muted-foreground">{selectedReceipt.user?.email || "-"}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-xs uppercase text-muted-foreground">Submitted At</p>
                  <p className="mt-1 text-sm font-medium">{formatDateTime(selectedReceipt.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-xs uppercase text-muted-foreground">Created By Admin</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedReceipt.user?.createdByAdmin?.fullName || "Not available"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedReceipt.user?.createdByAdmin?.email || "-"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted p-3">
                  <p className="text-xs uppercase text-muted-foreground">Receipt Amount</p>
                  <p className="mt-1 text-sm font-medium">{formatCurrency(selectedReceipt.amount)}</p>
                  <p className="text-xs text-muted-foreground">Type: {selectedReceipt.fileType.toUpperCase()}</p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold">File Preview</h3>
                {selectedReceipt.fileType === "image" ? (
                  <div className="overflow-hidden rounded-lg border border-border bg-background">
                    <img
                      src={selectedReceipt.fileUrl}
                      alt="Receipt preview"
                      className="max-h-[55dvh] w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-border bg-background">
                    <iframe
                      src={selectedReceipt.fileUrl}
                      title="Receipt PDF preview"
                      className="h-[55dvh] w-full"
                    />
                  </div>
                )}
                <a
                  href={selectedReceipt.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                >
                  Open file in new tab
                </a>
              </section>

              <div className="space-y-3 rounded-lg border border-border bg-muted p-3">
                <label htmlFor="modal-reason" className="text-xs uppercase text-muted-foreground">
                  Approval Reason
                </label>
                <input
                  id="modal-reason"
                  type="text"
                  value={reasonByReceiptId[selectedReceipt._id] || ""}
                  onChange={(event) =>
                    setReasonByReceiptId((prev) => ({
                      ...prev,
                      [selectedReceipt._id]: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Optional audit reason"
                  disabled={approvingId === selectedReceipt._id}
                />

                <button
                  type="button"
                  onClick={() => approve(selectedReceipt._id)}
                  disabled={approvingId === selectedReceipt._id}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {approvingId === selectedReceipt._id ? (
                    <>
                      <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                      Approving...
                    </>
                  ) : (
                    "Approve From Modal"
                  )}
                </button>
              </div>
            </div>
          </article>
        </div>
      )}
    </BlurLoadingContainer>
  );
};
