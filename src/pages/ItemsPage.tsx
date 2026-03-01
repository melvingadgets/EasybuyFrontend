import { useMemo } from "react";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useGetEasyBoughtItemsQuery } from "../store/api/backendApi";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const formatCurrency = (value: number) => currencyFormatter.format(value || 0);

export const ItemsPage = () => {
  const itemsQuery = useGetEasyBoughtItemsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const items = useMemo(() => itemsQuery.data?.data || [], [itemsQuery.data?.data]);
  const loading = itemsQuery.isLoading;
  const errorMessage = getRtkErrorMessage(itemsQuery.error as any, "Failed to load items");

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">EasyBought Items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of all your purchased items and their details.
          </p>
        </div>
        <div className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Total Items: {items.length}
        </div>
      </div>

      <BlurLoadingContainer loading={loading} minDurationMs={150}>
        <div className="mt-6">
          {errorMessage && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          <div className="mb-4 grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Down Payment</p>
              <p className="text-lg font-semibold">
                {formatCurrency(items.reduce((sum, item) => sum + (item.downPayment || 0), 0))}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Loaned Amount</p>
              <p className="text-lg font-semibold">
                {formatCurrency(items.reduce((sum, item) => sum + (item.loanedAmount || 0), 0))}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Weekly Plans</p>
              <p className="text-lg font-semibold">
                {items.filter((item) => item.Plan === "Weekly").length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-xs text-muted-foreground">Total Phone Price</p>
              <p className="text-lg font-semibold">
                {formatCurrency(items.reduce((sum, item) => sum + (item.PhonePrice || 0), 0))}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item._id} className="rounded-xl border border-border bg-muted p-4 hover:border-primary/40">
                <div className="mb-3 overflow-hidden rounded-lg border border-border bg-card">
                  <img src={item.IphoneImageUrl} alt={item.IphoneModel} className="h-36 w-full object-contain p-2" />
                </div>
                <h2 className="text-base font-semibold">{item.IphoneModel}</h2>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p>Capacity: {item.capacity || "-"}</p>
                  <p>Plan Type: {item.Plan}</p>
                  <p>Down Payment: {formatCurrency(item.downPayment)}</p>
                  <p>Loaned Amount: {formatCurrency(item.loanedAmount)}</p>
                  <p>Monthly Plan: {item.monthlyPlan ?? "-"}</p>
                  <p>Weekly Plan: {item.weeklyPlan ?? "-"}</p>
                  <p>Phone Price: {formatCurrency(item.PhonePrice)}</p>
                </div>
              </article>
            ))}
            {items.length === 0 && (
              <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">No items found.</p>
            )}
          </div>
        </div>
      </BlurLoadingContainer>
    </section>
  );
};
