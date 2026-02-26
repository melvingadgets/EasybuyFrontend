import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

const IPHONE_OPTIONS = [
  { model: "iPhone XR", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xr-new.jpg" },
  { model: "iPhone XS", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-new.jpg" },
  { model: "iPhone XS Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-xs-max-new1.jpg" },
  { model: "iPhone 11", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11.jpg" },
  { model: "iPhone 11 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro.jpg" },
  { model: "iPhone 11 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max.jpg" },
  { model: "iPhone 12", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12.jpg" },
  { model: "iPhone 12 mini", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-mini.jpg" },
  { model: "iPhone 12 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro--.jpg" },
  { model: "iPhone 12 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-12-pro-max-.jpg" },
  { model: "iPhone 13", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13.jpg" },
  { model: "iPhone 13 mini", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-mini.jpg" },
  { model: "iPhone 13 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro.jpg" },
  { model: "iPhone 13 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg" },
  { model: "iPhone 14", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14.jpg" },
  { model: "iPhone 14 Plus", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-plus.jpg" },
  { model: "iPhone 14 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro.jpg" },
  { model: "iPhone 14 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg" },
  { model: "iPhone 15", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15.jpg" },
  { model: "iPhone 15 Plus", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus-.jpg" },
  { model: "iPhone 15 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro.jpg" },
  { model: "iPhone 15 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-pro-max.jpg" },
  { model: "iPhone 16", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg" },
  { model: "iPhone 16 Plus", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg" },
  { model: "iPhone 16 Pro", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg" },
  { model: "iPhone 16 Pro Max", imageUrl: "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg" },
  { model: "iPhone 17", imageUrl: "https://placehold.co/600x600?text=iPhone+17" },
  { model: "iPhone 17 Pro", imageUrl: "https://placehold.co/600x600?text=iPhone+17+Pro" },
  { model: "iPhone 17 Pro Max", imageUrl: "https://placehold.co/600x600?text=iPhone+17+Pro+Max" },
] as const;

const WEEKLY_ONLY_MODELS = new Set([
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 11",
  "iPhone 11 Pro",
  "iPhone 11 Pro Max",
  "iPhone 12",
  "iPhone 12 mini",
  "iPhone 12 Pro",
  "iPhone 12 Pro Max",
]);

const SIXTY_PERCENT_DOWNPAYMENT_MODELS = new Set([
  "iPhone XR",
  "iPhone XS",
  "iPhone XS Max",
  "iPhone 17",
  "iPhone 17 Pro",
  "iPhone 17 Pro Max",
]);

const getWeeklyMarkupMultiplier = (weeks: number) => {
  if (weeks === 4) return 1.2;
  if (weeks === 8) return 1.4;
  if (weeks === 12) return 1.5;
  return 1;
};

const getMonthlyMarkupMultiplier = (months: number) => {
  if (months === 1) return 1.2;
  if (months === 2) return 1.4;
  if (months === 3) return 1.6;
  return 1;
};

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
    return `₦${formattedInteger}.`;
  }
  return decimals.length ? `₦${formattedInteger}.${decimals}` : `₦${formattedInteger}`;
};

const formatAmount = (value: number) => amountFormatter.format(value || 0);

export const CreateItemPage = () => {
  const [form, setForm] = useState({
    IphoneModel: "iPhone XR",
    Plan: "Weekly",
    PhonePrice: "",
    downPayment: "",
    monthlyPlan: "1",
    weeklyPlan: "4",
    UserEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [downPaymentTouched, setDownPaymentTouched] = useState(false);
  const selectedPhone = useMemo(
    () => IPHONE_OPTIONS.find((item) => item.model === form.IphoneModel) || IPHONE_OPTIONS[0],
    [form.IphoneModel]
  );
  const isWeeklyOnly = WEEKLY_ONLY_MODELS.has(form.IphoneModel);
  const downPaymentMultiplier = SIXTY_PERCENT_DOWNPAYMENT_MODELS.has(form.IphoneModel) ? 0.6 : 0.4;

  useEffect(() => {
    if (isWeeklyOnly && form.Plan !== "Weekly") {
      setForm((prev) => ({ ...prev, Plan: "Weekly" }));
    }
  }, [form.Plan, isWeeklyOnly]);

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

  const calculatedDownPayment = useMemo(() => {
    return parseFormattedNumber(form.downPayment);
  }, [form.downPayment]);

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

  const calculatedLoanedAmount = useMemo(() => {
    return Math.max(phonePriceNumber - calculatedDownPayment, 0);
  }, [calculatedDownPayment, phonePriceNumber]);

  const calculatedNextPayment = useMemo(() => {
    const resolvedPlan = isWeeklyOnly ? "Weekly" : form.Plan;
    if (resolvedPlan === "Monthly") {
      const months = Number(form.monthlyPlan) || 0;
      const multiplier = getMonthlyMarkupMultiplier(months);
      if (months <= 0) return 0;
      return (calculatedLoanedAmount * multiplier) / months;
    }
    const weeks = Number(form.weeklyPlan) || 0;
    const multiplier = getWeeklyMarkupMultiplier(weeks);
    if (weeks <= 0) return 0;
    return (calculatedLoanedAmount * multiplier) / weeks;
  }, [calculatedLoanedAmount, form.Plan, form.weeklyPlan, form.monthlyPlan, isWeeklyOnly]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
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
      const resolvedPlan = isWeeklyOnly ? "Weekly" : form.Plan;
      const payload = {
        IphoneModel: form.IphoneModel,
        ItemName: form.IphoneModel,
        Plan: resolvedPlan,
        downPayment: calculatedDownPayment,
        loanedAmount: calculatedLoanedAmount,
        PhonePrice: phonePriceNumber,
        ...(resolvedPlan === "Monthly"
          ? { monthlyPlan: Number(form.monthlyPlan) }
          : { weeklyPlan: Number(form.weeklyPlan) }),
        UserEmail: form.UserEmail.trim()
      };
      const { data } = await api.post("/api/v1/user/createeasyboughtitem", payload);
      toast.success(data?.message || "Item created");
      setForm({
        IphoneModel: "iPhone XR",
        Plan: "Weekly",
        PhonePrice: "",
        downPayment: "",
        monthlyPlan: "1",
        weeklyPlan: "4",
        UserEmail: ""
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
       <code></code>
      </p>

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
            required
          >
            {IPHONE_OPTIONS.map((option) => (
              <option key={option.model} value={option.model}>
                {option.model}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 overflow-hidden rounded-xl border border-border bg-muted">
          <img src={selectedPhone.imageUrl} alt={form.IphoneModel} className="h-44 w-full object-contain p-3" />
        </div>
        <div className="space-y-2">
          <label htmlFor="plan-type" className="text-sm font-medium">
            Plan Type
          </label>
          <select
            id="plan-type"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={form.Plan}
            onChange={(e) => setForm({ ...form, Plan: e.target.value as "Monthly" | "Weekly" })}
            disabled={isWeeklyOnly}
            required
          >
            <option value="Weekly">Weekly</option>
            {!isWeeklyOnly && <option value="Monthly">Monthly</option>}
          </select>
        </div>
        <p className="rounded-md border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          {isWeeklyOnly ? "This model supports Weekly plan only." : "This model supports Weekly and Monthly plans."}
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
            placeholder="e.g., ₦1,250,000"
            value={form.PhonePrice}
            onChange={(e) => setForm({ ...form, PhonePrice: formatInputWithCommas(e.target.value) })}
            required
          />
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
            placeholder="e.g., ₦500,000"
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
            placeholder={
              (isWeeklyOnly ? "Weekly" : form.Plan) === "Weekly"
                ? "(Loaned + % Markup) / Weeks"
                : "(Loaned + % Markup) / Months"
            }
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
              onChange={(e) => setForm({ ...form, monthlyPlan: e.target.value as "1" | "2" | "3" })}
              required
            >
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="3">3 Months</option>
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
              onChange={(e) => setForm({ ...form, weeklyPlan: e.target.value as "4" | "8" | "12" })}
              required
            >
              <option value="4">4 Weeks</option>
              <option value="8">8 Weeks</option>
              <option value="12">12 Weeks</option>
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
          disabled={loading || phonePriceNumber <= 0 || invalidDownPayment}
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
