import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { BlurLoadingContainer } from "../components/BlurLoadingContainer";
import { getRtkErrorMessage } from "../lib/rtkError";
import {
  useGetSuperAdminEasyBuyPricingQuery,
  useUpdateSuperAdminEasyBuyPricingMutation,
} from "../store/api/backendApi";

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

  if (hasTrailingDot && !decimals.length) {
    return formattedInteger + ".";
  }
  return decimals.length ? `${formattedInteger}.${decimals}` : formattedInteger;
};

const buildRowKey = (model: string, capacity: string) => `${model}__${capacity}`;

type PricingRow = {
  model: string;
  capacity: string;
  currentPrice: number;
};

export const SuperAdminPricingPage = () => {
  const pricingQuery = useGetSuperAdminEasyBuyPricingQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [updatePricing] = useUpdateSuperAdminEasyBuyPricingMutation();

  const [draftByKey, setDraftByKey] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  const models = useMemo(() => pricingQuery.data?.data?.models || [], [pricingQuery.data?.data?.models]);
  const rows = useMemo<PricingRow[]>(
    () =>
      models.flatMap((model) =>
        model.capacities.map((capacity) => ({
          model: model.model,
          capacity,
          currentPrice: Number(model.pricesByCapacity?.[capacity] || 0),
        }))
      ),
    [models]
  );

  const rowByKey = useMemo(() => {
    const map = new Map<string, PricingRow>();
    for (const row of rows) {
      map.set(buildRowKey(row.model, row.capacity), row);
    }
    return map;
  }, [rows]);

  const loading = pricingQuery.isLoading;
  const errorMessage = getRtkErrorMessage(pricingQuery.error as any, "Failed to load pricing");

  const getDisplayPrice = (row: PricingRow) => {
    const key = buildRowKey(row.model, row.capacity);
    const draft = draftByKey[key];
    if (draft !== undefined) return draft;
    return row.currentPrice > 0 ? formatInputWithCommas(String(row.currentPrice)) : "";
  };

  const isRowDirty = (row: PricingRow) => {
    const key = buildRowKey(row.model, row.capacity);
    if (draftByKey[key] === undefined) return false;
    const draftValue = parseFormattedNumber(draftByKey[key] || "");
    return Number(draftValue.toFixed(2)) !== Number(row.currentPrice.toFixed(2));
  };

  const changedRows = useMemo(() => rows.filter((row) => isRowDirty(row)), [rows, draftByKey]);

  const saveSingleRow = async (row: PricingRow) => {
    const key = buildRowKey(row.model, row.capacity);
    const parsedPrice = parseFormattedNumber(getDisplayPrice(row));

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error(`Enter a valid price for ${row.model} ${row.capacity}`);
      return;
    }

    setSavingKey(key);
    try {
      const response = await updatePricing({
        updates: [{ model: row.model, capacity: row.capacity, price: Number(parsedPrice.toFixed(2)) }],
      }).unwrap();
      toast.success(response?.message || "Price updated");
      setDraftByKey((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } finally {
      setSavingKey(null);
    }
  };

  const saveAllChanged = async () => {
    if (!changedRows.length) {
      toast.error("No changed prices to save");
      return;
    }

    const updates: Array<{ model: string; capacity: string; price: number }> = [];
    for (const row of changedRows) {
      const parsedPrice = parseFormattedNumber(getDisplayPrice(row));
      if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        toast.error(`Invalid price for ${row.model} ${row.capacity}`);
        return;
      }
      updates.push({
        model: row.model,
        capacity: row.capacity,
        price: Number(parsedPrice.toFixed(2)),
      });
    }

    setSavingAll(true);
    try {
      const response = await updatePricing({ updates }).unwrap();
      toast.success(
        response?.message ||
          `Updated ${updates.length} ${updates.length === 1 ? "price" : "prices"} successfully`
      );
      setDraftByKey({});
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <BlurLoadingContainer loading={loading} minDurationMs={150}>
      <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">EasyBuy Capacity Pricing</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update backend prices by model and capacity. Admin create-item will auto-fill from these values.
            </p>
          </div>
          <button
            type="button"
            onClick={saveAllChanged}
            disabled={savingAll || !changedRows.length}
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {savingAll ? (
              <>
                <ClipLoader color="hsl(var(--primary-foreground))" size={14} speedMultiplier={0.9} />
                Saving...
              </>
            ) : (
              `Save All Changed (${changedRows.length})`
            )}
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <div className="mt-5 w-full max-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border rounded-lg border border-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Model</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Capacity</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Current</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">New Price (NGN)</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {rows.map((row) => {
                const key = buildRowKey(row.model, row.capacity);
                const rowSaving = savingKey === key;
                const dirty = isRowDirty(row);

                return (
                  <tr key={key}>
                    <td className="px-3 py-2 text-sm">{row.model}</td>
                    <td className="px-3 py-2 text-sm">{row.capacity}</td>
                    <td className="px-3 py-2 text-sm">
                      {row.currentPrice > 0 ? formatCurrency(row.currentPrice) : "-"}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={getDisplayPrice(row)}
                        onChange={(event) =>
                          setDraftByKey((prev) => ({
                            ...prev,
                            [key]: formatInputWithCommas(event.target.value),
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="e.g. 1,250,000"
                        disabled={rowSaving || savingAll}
                      />
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <button
                        type="button"
                        onClick={() => saveSingleRow(row)}
                        disabled={!dirty || rowSaving || savingAll}
                        className="flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-60"
                      >
                        {rowSaving ? (
                          <>
                            <ClipLoader color="hsl(var(--primary-foreground))" size={14} speedMultiplier={0.9} />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-sm text-muted-foreground" colSpan={5}>
                    No pricing rows available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!!Object.keys(draftByKey).length && (
          <p className="mt-3 text-xs text-muted-foreground">
            Unsaved edits: {changedRows.length}
          </p>
        )}
      </section>
    </BlurLoadingContainer>
  );
};
