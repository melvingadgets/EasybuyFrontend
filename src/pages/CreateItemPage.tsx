import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { api } from "../lib/api";
import { getRtkErrorMessage } from "../lib/rtkError";
import { useGetEasyBuyCatalogQuery } from "../store/api/backendApi";

type PlanType = "Monthly" | "Weekly";

const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

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
    return `NGN ${formattedInteger}.`;
  }
  return decimals.length ? `NGN ${formattedInteger}.${decimals}` : `NGN ${formattedInteger}`;
};

const formatAmount = (value: number) => amountFormatter.format(value || 0);

const getSafePlan = (plan: string): PlanType => (plan === "Monthly" ? "Monthly" : "Weekly");

export const CreateItemPage = () => {
  const catalogQuery = useGetEasyBuyCatalogQuery();

  const [form, setForm] = useState({
    IphoneModel: "",
    capacity: "",
    Plan: "Weekly" as PlanType,
    PhonePrice: "",
    downPayment: "",
    monthlyPlan: "1",
    weeklyPlan: "4",
    UserEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [downPaymentTouched, setDownPaymentTouched] = useState(false);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);

  const catalogData = catalogQuery.data?.data;
  const catalog = useMemo(() => catalogData?.models || [], [catalogData?.models]);
  const planRules = catalogData?.planRules;
  const catalogErrorMessage = getRtkErrorMessage(catalogQuery.error as any, "Failed to load iPhone catalog");

  const selectedModel = useMemo(
    () => catalog.find((item) => item.model === form.IphoneModel) || null,
    [catalog, form.IphoneModel]
  );

  const availableCapacities = selectedModel?.capacities || [];
  const monthlyDurations = planRules?.monthlyDurations || [];
  const weeklyDurations = planRules?.weeklyDurations || [];
  const selectedCapacityPrice = useMemo(() => {
    if (!selectedModel || !form.capacity) return 0;
    const rawPrice = Number(selectedModel.pricesByCapacity?.[form.capacity]);
    return Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
  }, [selectedModel, form.capacity]);
  const isWeeklyOnly =
    selectedModel?.allowedPlans.length === 1 && selectedModel.allowedPlans[0] === "Weekly";
  const downPaymentMultiplier = (selectedModel?.downPaymentPercentage || 40) / 100;

  useEffect(() => {
    if (!catalog.length) return;

    setForm((prev) => {
      const stillExists = catalog.some((item) => item.model === prev.IphoneModel);
      if (stillExists) return prev;

      const first = catalog[0];
      const firstCapacity = first.capacities[0] || "";
      const firstPrice = Number(first.pricesByCapacity?.[firstCapacity] || 0);
      return {
        ...prev,
        IphoneModel: first.model,
        capacity: firstCapacity,
        Plan: getSafePlan(first.allowedPlans[0] || "Weekly"),
        PhonePrice: firstPrice > 0 ? formatInputWithCommas(String(firstPrice)) : "",
        monthlyPlan: String(planRules?.monthlyDurations[0] || 1),
        weeklyPlan: String(planRules?.weeklyDurations[0] || 4),
      };
    });
  }, [catalog, planRules?.monthlyDurations, planRules?.weeklyDurations]);

  useEffect(() => {
    if (!planRules) return;

    setForm((prev) => {
      let next = prev;

      if (!planRules.monthlyDurations.includes(Number(next.monthlyPlan))) {
        next = { ...next, monthlyPlan: String(planRules.monthlyDurations[0] || 1) };
      }

      if (!planRules.weeklyDurations.includes(Number(next.weeklyPlan))) {
        next = { ...next, weeklyPlan: String(planRules.weeklyDurations[0] || 4) };
      }

      return next;
    });
  }, [planRules]);

  useEffect(() => {
    if (!selectedModel) return;

    setForm((prev) => {
      let next = prev;
      if (!selectedModel.allowedPlans.includes(prev.Plan)) {
        next = { ...next, Plan: getSafePlan(selectedModel.allowedPlans[0] || "Weekly") };
      }

      if (!selectedModel.capacities.includes(next.capacity)) {
        next = { ...next, capacity: selectedModel.capacities[0] || "" };
      }

      return next;
    });
  }, [selectedModel]);

  useEffect(() => {
    setPreviewUnavailable(false);
  }, [selectedModel?.imageUrl]);

  useEffect(() => {
    if (!selectedModel || !form.capacity) return;

    if (selectedCapacityPrice <= 0) {
      setForm((prev) => {
        if (!prev.PhonePrice) return prev;
        return {
          ...prev,
          PhonePrice: "",
        };
      });
      setDownPaymentTouched(false);
      return;
    }

    setForm((prev) => {
      const currentPrice = parseFormattedNumber(prev.PhonePrice);
      if (currentPrice === selectedCapacityPrice) {
        return prev;
      }
      return {
        ...prev,
        PhonePrice: formatInputWithCommas(String(selectedCapacityPrice)),
      };
    });
    setDownPaymentTouched(false);
  }, [form.capacity, selectedCapacityPrice, selectedModel]);

  useEffect(() => {
    if (downPaymentTouched) return;

    const phonePrice = parseFormattedNumber(form.PhonePrice);
    const minimumDownPayment = phonePrice * downPaymentMultiplier;
    setForm((prev) => ({
      ...prev,
      downPayment: minimumDownPayment > 0 ? formatInputWithCommas(minimumDownPayment.toFixed(2)) : "",
    }));
  }, [downPaymentMultiplier, downPaymentTouched, form.PhonePrice]);

  const phonePriceNumber = useMemo(() => parseFormattedNumber(form.PhonePrice), [form.PhonePrice]);
  const minimumRequiredDownPayment = useMemo(
    () => phonePriceNumber * downPaymentMultiplier,
    [downPaymentMultiplier, phonePriceNumber]
  );

  const calculatedDownPayment = useMemo(() => parseFormattedNumber(form.downPayment), [form.downPayment]);

  const downPaymentTooLow = useMemo(
    () => calculatedDownPayment < minimumRequiredDownPayment && phonePriceNumber > 0,
    [calculatedDownPayment, minimumRequiredDownPayment, phonePriceNumber]
  );

  const downPaymentAbovePhonePrice = useMemo(
    () => calculatedDownPayment > phonePriceNumber && phonePriceNumber > 0,
    [calculatedDownPayment, phonePriceNumber]
  );

  const invalidDownPayment = useMemo(
    () => calculatedDownPayment <= 0 || downPaymentTooLow || downPaymentAbovePhonePrice,
    [calculatedDownPayment, downPaymentAbovePhonePrice, downPaymentTooLow]
  );

  const calculatedLoanedAmount = useMemo(
    () => Math.max(phonePriceNumber - calculatedDownPayment, 0),
    [calculatedDownPayment, phonePriceNumber]
  );

  const calculatedNextPayment = useMemo(() => {
      const resolvedPlan = selectedModel?.allowedPlans.includes(form.Plan)
        ? form.Plan
        : selectedModel?.allowedPlans[0] || "Weekly";

    if (resolvedPlan === "Monthly") {
      const months = Number(form.monthlyPlan) || 0;
      const multiplier = planRules?.monthlyMarkupMultipliers[String(months)] || 1;
      if (months <= 0) return 0;
      return (calculatedLoanedAmount * multiplier) / months;
    }

    const weeks = Number(form.weeklyPlan) || 0;
    const multiplier = planRules?.weeklyMarkupMultipliers[String(weeks)] || 1;
    if (weeks <= 0) return 0;
    return (calculatedLoanedAmount * multiplier) / weeks;
  }, [calculatedLoanedAmount, form.Plan, form.weeklyPlan, form.monthlyPlan, selectedModel, planRules]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedModel) {
      toast.error("Model catalog is unavailable");
      return;
    }

    if (!form.capacity.trim()) {
      toast.error("Select a valid device capacity");
      return;
    }

    if (phonePriceNumber <= 0) {
      toast.error("Enter a valid phone price greater than zero");
      return;
    }

    if (invalidDownPayment) {
      if (downPaymentTooLow) {
        toast.error(`Down payment cannot be below ${formatAmount(minimumRequiredDownPayment)} for this model`);
      } else if (downPaymentAbovePhonePrice) {
        toast.error("Down payment cannot be greater than the phone price");
      } else {
        toast.error("Enter a valid down payment");
      }
      return;
    }

    setLoading(true);
    try {
      const resolvedPlan = selectedModel.allowedPlans.includes(form.Plan)
        ? form.Plan
        : selectedModel.allowedPlans[0] || "Weekly";

      const payload = {
        IphoneModel: form.IphoneModel,
        ItemName: form.IphoneModel,
        capacity: form.capacity,
        Plan: resolvedPlan,
        downPayment: calculatedDownPayment,
        loanedAmount: calculatedLoanedAmount,
        PhonePrice: phonePriceNumber,
        ...(resolvedPlan === "Monthly"
          ? { monthlyPlan: Number(form.monthlyPlan) }
          : { weeklyPlan: Number(form.weeklyPlan) }),
        UserEmail: form.UserEmail.trim(),
      };

      const { data } = await api.post("/api/v1/user/createeasyboughtitem", payload);
      toast.success(data?.message || "Item created");

      const first = catalog[0];
      const firstCapacity = first?.capacities[0] || "";
      const firstPrice = Number(first?.pricesByCapacity?.[firstCapacity] || 0);
      setForm({
        IphoneModel: first?.model || "",
        capacity: firstCapacity,
        Plan: getSafePlan(first?.allowedPlans[0] || "Weekly"),
        PhonePrice: firstPrice > 0 ? formatInputWithCommas(String(firstPrice)) : "",
        downPayment: "",
        monthlyPlan: String(planRules?.monthlyDurations[0] || 1),
        weeklyPlan: String(planRules?.weeklyDurations[0] || 4),
        UserEmail: "",
      });
      setDownPaymentTouched(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
      <h1 className="text-xl font-semibold">Create EasyBought Item (Admin)</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Model and capacity options are loaded from backend catalog rules.
      </p>

      {catalogErrorMessage && (
        <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{catalogErrorMessage}</div>
      )}

      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="iphone-model" className="text-sm font-medium">
            iPhone Model
          </label>
          <select
            id="iphone-model"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.IphoneModel}
            onChange={(e) => setForm({ ...form, IphoneModel: e.target.value })}
            disabled={catalogQuery.isLoading || !catalog.length}
            required
          >
            {catalog.map((option) => (
              <option key={option.model} value={option.model}>
                {option.model}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="capacity" className="text-sm font-medium">
            Capacity
          </label>
          <select
            id="capacity"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            disabled={!selectedModel || !availableCapacities.length}
            required
          >
            {availableCapacities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          {selectedModel && !previewUnavailable ? (
            <img
              src={selectedModel.imageUrl}
              alt={form.IphoneModel}
              className="h-28 w-full object-contain p-3"
              onError={() => setPreviewUnavailable(true)}
            />
          ) : (
            <div className="flex h-28 items-center justify-center text-xs text-muted-foreground">
              Model preview unavailable
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="plan-type" className="text-sm font-medium">
            Plan Type
          </label>
          <select
            id="plan-type"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.Plan}
            onChange={(e) => setForm({ ...form, Plan: getSafePlan(e.target.value) })}
            disabled={!selectedModel || isWeeklyOnly}
            required
          >
            {selectedModel?.allowedPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        <p className="rounded-md border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          {selectedModel
            ? `This model supports ${selectedModel.allowedPlans.join(" and ")} plans.`
            : "Select a model to view supported plan type."}
        </p>

        <div className="space-y-2">
          <label htmlFor="phone-price" className="text-sm font-medium">
            Phone Price (NGN)
          </label>
          <input
            id="phone-price"
            className="w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="text"
            inputMode="decimal"
            placeholder="e.g., NGN 1,250,000"
            value={form.PhonePrice}
            onChange={(e) => setForm({ ...form, PhonePrice: formatInputWithCommas(e.target.value) })}
            required
          />
          <p className="text-xs text-muted-foreground">
            Auto-filled from SuperAdmin pricing for selected model/capacity. You can still edit it.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="down-payment" className="text-sm font-medium">
            Down Payment
          </label>
          <input
            id="down-payment"
            className={`w-full rounded-md border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
              downPaymentTooLow || downPaymentAbovePhonePrice
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                : "border-input bg-background"
            }`}
            type="text"
            inputMode="decimal"
            placeholder="e.g., NGN 500,000"
            value={form.downPayment}
            onChange={(e) => {
              setDownPaymentTouched(true);
              setForm({ ...form, downPayment: formatInputWithCommas(e.target.value) });
            }}
            required
          />
          <p className="text-xs text-muted-foreground">
            Minimum required: {formatAmount(minimumRequiredDownPayment)} ({downPaymentMultiplier * 100}% of phone price)
          </p>
          {downPaymentTooLow && (
            <p className="text-xs text-amber-600 dark:text-amber-300">
              Warning: down payment is below the required minimum for this model.
            </p>
          )}
          {downPaymentAbovePhonePrice && (
            <p className="text-xs text-destructive">Down payment cannot be greater than phone price.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="loaned-amount" className="text-sm font-medium">
            Loaned Amount
          </label>
          <input
            id="loaned-amount"
            className="w-full rounded-md border border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground focus:outline-none"
            type="text"
            placeholder="Phone Price - Down Payment"
            value={Number.isFinite(calculatedLoanedAmount) ? formatAmount(calculatedLoanedAmount) : "0"}
            readOnly
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="next-payment" className="text-sm font-medium">
            Next Payment
          </label>
          <input
            id="next-payment"
            className="w-full rounded-md border border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground focus:outline-none"
            type="text"
            placeholder={(isWeeklyOnly ? "Weekly" : form.Plan) === "Weekly" ? "(Loaned + % Markup) / Weeks" : "(Loaned + % Markup) / Months"}
            value={Number.isFinite(calculatedNextPayment) ? formatAmount(Number(calculatedNextPayment.toFixed(2))) : "0"}
            readOnly
          />
        </div>

        {form.Plan === "Monthly" ? (
          <div className="space-y-2">
            <label htmlFor="monthly-plan" className="text-sm font-medium">
              Monthly Plan Duration
            </label>
            <select
              id="monthly-plan"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.monthlyPlan}
              onChange={(e) => setForm({ ...form, monthlyPlan: e.target.value })}
              required
            >
              {monthlyDurations.map((months) => (
                <option key={months} value={months}>
                  {months} {months === 1 ? "Month" : "Months"}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="weekly-plan" className="text-sm font-medium">
              Weekly Plan Duration
            </label>
            <select
              id="weekly-plan"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.weeklyPlan}
              onChange={(e) => setForm({ ...form, weeklyPlan: e.target.value })}
              required
            >
              {weeklyDurations.map((weeks) => (
                <option key={weeks} value={weeks}>
                  {weeks} Weeks
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="user-email" className="text-sm font-medium">
            User Email
          </label>
          <input
            id="user-email"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="email"
            placeholder="e.g., user@example.com"
            value={form.UserEmail}
            onChange={(e) => setForm({ ...form, UserEmail: e.target.value })}
            required
          />
        </div>

        <button
          disabled={loading || catalogQuery.isLoading || !selectedModel || !form.capacity || phonePriceNumber <= 0 || invalidDownPayment}
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-2"
        >
          {loading ? (
            <>
              <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
              Creating...
            </>
          ) : (
            "Create Item"
          )}
        </button>
      </form>
    </section>
  );
};
