import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ApiSuccess, PendingReceiptItem } from "../types/api";
import toast from "react-hot-toast";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

export const AdminReceiptApprovalsPage = () => {
  const [receipts, setReceipts] = useState<PendingReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ApiSuccess<PendingReceiptItem[]>>("/api/v1/receipt/pending");
      setReceipts(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const approve = async (receiptId: string) => {
    setApprovingId(receiptId);
    try {
      const { data } = await api.patch(`/api/v1/receipt/${receiptId}/approve`);
      toast.success(data?.message || "Payment approved");
      await fetchPending();
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <h1 className="text-xl font-semibold">Admin Receipt Approvals</h1>
      <p className="mt-1 text-sm text-muted-foreground">Approve pending receipt-backed payments.</p>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading pending receipts...</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-border rounded-lg border border-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">User</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Email</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Receipt</th>
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
                    <a className="text-primary hover:underline" href={receipt.fileUrl} target="_blank" rel="noreferrer">
                      Open {receipt.fileType.toUpperCase()}
                    </a>
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      type="button"
                      onClick={() => approve(receipt._id)}
                      disabled={approvingId === receipt._id}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-60"
                    >
                      {approvingId === receipt._id ? "Approving..." : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
              {receipts.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={5}>
                    No pending receipts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
