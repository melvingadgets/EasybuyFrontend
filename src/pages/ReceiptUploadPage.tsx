import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import ClipLoader from "react-spinners/ClipLoader";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useGetMyReceiptsQuery, useUploadReceiptMutation } from "../store/api/backendApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

const parseFormattedNumber = (value: string) => {
  const numeric = Number(String(value || "").replace(/,/g, ""));
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

  if (hasTrailingDot && !decimals.length) {
    return `${formattedInteger}.`;
  }
  return decimals.length ? `${formattedInteger}.${decimals}` : formattedInteger;
};

export const ReceiptUploadPage = () => {
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const receiptsQuery = useGetMyReceiptsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [uploadReceipt, { isLoading: loading }] = useUploadReceiptMutation();

  const receipts = useMemo(() => receiptsQuery.data?.data || [], [receiptsQuery.data?.data]);
  const loadingTable = receiptsQuery.isLoading;
  const receiptsError = getRtkErrorMessage(receiptsQuery.error as any, "Failed to load receipts");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select an image or PDF receipt");
      return;
    }
    const parsedAmount = parseFormattedNumber(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid amount greater than zero");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Image", file);
      formData.append("amount", String(parsedAmount));
      const response = await uploadReceipt(formData).unwrap();
      toast.success(response?.message || "Receipt uploaded");
      setAmount("");
      setFile(null);
      setFileInputKey((prev) => prev + 1);
    } catch (_error) {
      // Error toast already handled by the shared RTK base query wrapper.
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h1 className="text-xl font-semibold">Upload Receipt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload image/PDF receipt. New submissions stay <strong>pending</strong> until admin approval.
        </p>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-3">
          <input
            type="text"
            inputMode="decimal"
            placeholder="Amount (e.g., 12,500)"
            className="rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={amount}
            onChange={(e) => setAmount(formatInputWithCommas(e.target.value))}
            required
          />
          <input
            key={fileInputKey}
            type="file"
            accept="image/*,.pdf"
            className="rounded-md border border-input bg-background px-3 py-2.5 text-sm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-3"
          >
            {loading ? (
              <>
                <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                Uploading...
              </>
            ) : (
              "Upload Receipt"
            )}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h2 className="text-lg font-semibold">My Receipts</h2>
        <BlurLoadingContainer loading={loadingTable} minDurationMs={150}>
          <div className="mt-4 w-full max-w-full overflow-x-auto">
            {receiptsError && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {receiptsError}
              </div>
            )}

            <table className="min-w-full divide-y divide-border rounded-lg border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">File</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {receipts.map((receipt) => (
                  <tr key={receipt._id}>
                    <td className="px-3 py-2 text-sm">{new Date(receipt.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 text-sm">{formatCurrency(receipt.amount)}</td>
                    <td className="px-3 py-2 text-sm">
                      <a className="text-primary hover:underline" href={receipt.fileUrl} target="_blank" rel="noreferrer">
                        View {receipt.fileType.toUpperCase()}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          receipt.status === "approved"
                            ? "bg-success/15 text-success"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {receipt.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {receipts.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={4}>
                      No receipts uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </BlurLoadingContainer>
      </div>
    </section>
  );
};
