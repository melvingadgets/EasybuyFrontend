import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { api } from "../lib/api";
import { trackEvent } from "../lib/analytics";
import { initializeTikTokPixel, trackTikTokEvent, trackTikTokPageView } from "../lib/tiktokPixel";
import type { EasyBuyCatalogResponse, FinanceProviderInfo } from "../types/api";

type PlanType = "Monthly" | "Weekly";
type PlanSelection = "" | PlanType;

type PublicCatalogResponse = {
  message: string;
  data?: EasyBuyCatalogResponse;
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
    return `NGN ${formattedInteger}.`;
  }
  return decimals.length ? `NGN ${formattedInteger}.${decimals}` : `NGN ${formattedInteger}`;
};

const formatAmount = (value: number) => amountFormatter.format(value || 0);

const getSafePlan = (plan: string): PlanType => (plan === "Monthly" ? "Monthly" : "Weekly");

const getOrCreateAnonymousId = () => {
  const key = "easybuy_public_anonymous_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `anon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(key, created);
  return created;
};

const PUBLIC_WHATSAPP_NUMBER = "2347086758713";

const buildPublicWhatsAppUrl = (params: {
  fullName: string;
  email: string;
  phone: string;
  iphoneModel: string;
  capacity: string;
  plan: "Monthly" | "Weekly";
}) => {
  const message = [
    "Hello Admin, I just submitted an EasyBuy request.",
    `Name: ${params.fullName}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone}`,
    `Device: ${params.iphoneModel} (${params.capacity})`,
    `Plan: ${params.plan}`,
  ].join("\n");

  return `https://api.whatsapp.com/send?phone=${PUBLIC_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
};

export const PublicEasyBuyRequestPage = () => {
  const pixelPageTrackedRef = useRef(false);
  const formStartTrackedRef = useRef(false);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [providers, setProviders] = useState<FinanceProviderInfo[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [catalog, setCatalog] = useState<EasyBuyCatalogResponse["models"]>([]);
  const [planRules, setPlanRules] = useState<EasyBuyCatalogResponse["planRules"] | null>(null);
  const [catalogError, setCatalogError] = useState("");
  const [submittedRequestId, setSubmittedRequestId] = useState("");
  const [resending, setResending] = useState(false);
  const [contactAdminModalOpen, setContactAdminModalOpen] = useState(false);
  const [contactAdminWhatsAppUrl, setContactAdminWhatsAppUrl] = useState("");
  const [downPaymentTouched, setDownPaymentTouched] = useState(false);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    iphoneModel: "",
    capacity: "",
    plan: "" as PlanSelection,
    phonePrice: "",
    downPayment: "",
    monthlyPlan: "1",
    weeklyPlan: "",
  });

  const selectedModel = useMemo(
    () => catalog.find((item) => item.model === form.iphoneModel) || null,
    [catalog, form.iphoneModel]
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
  const phonePriceNumber = useMemo(() => parseFormattedNumber(form.phonePrice), [form.phonePrice]);
  const downPaymentPercentage = useMemo(() => {
    const rule = planRules?.downPaymentRule;
    if (rule?.type === "flat") {
      const flat = Number(rule.percentage);
      return Number.isFinite(flat) && flat > 0 ? flat : 0;
    }

    if (rule?.type === "price_threshold") {
      const matchedThreshold = [...rule.thresholds]
        .sort((a, b) => b.minPrice - a.minPrice)
        .find((threshold) => phonePriceNumber >= threshold.minPrice);

      const thresholdPercentage = Number(matchedThreshold?.percentage);
      return Number.isFinite(thresholdPercentage) && thresholdPercentage > 0
        ? thresholdPercentage
        : 0;
    }

    const raw = Number(selectedModel?.downPaymentPercentage);
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }, [phonePriceNumber, planRules?.downPaymentRule, selectedModel?.downPaymentPercentage]);
  const downPaymentMultiplier = downPaymentPercentage / 100;

  useEffect(() => {
    initializeTikTokPixel();
    if (pixelPageTrackedRef.current) return;
    trackTikTokPageView();
    trackEvent("page_view");
    pixelPageTrackedRef.current = true;
  }, []);

  useEffect(() => {
    let active = true;
    const loadProviders = async () => {
      setLoadingProviders(true);
      try {
        const response = await api.get<{ message: string; data?: FinanceProviderInfo[] }>(
          "/api/v1/public/providers",
          { suppressErrorToast: false } as any
        );
        const list = response.data?.data || [];
        if (!active) return;
        setProviders(list);
        if (list.length > 0) {
          setSelectedProvider(list[0].slug);
        }
      } catch (_error) {
        if (!active) return;
        setProviders([{ slug: "aurapay", displayName: "AuraPay" }]);
        setSelectedProvider("aurapay");
      } finally {
        if (active) setLoadingProviders(false);
      }
    };
    loadProviders();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProvider) return;
    setForm((prev) => ({
      fullName: prev.fullName,
      email: prev.email,
      phone: prev.phone,
      iphoneModel: "",
      capacity: "",
      plan: "" as PlanSelection,
      phonePrice: "",
      downPayment: "",
      monthlyPlan: "",
      weeklyPlan: "",
    }));
    setDownPaymentTouched(false);
    setCatalogError("");

    let active = true;
    const loadCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const response = await api.get<PublicCatalogResponse>(
          `/api/v1/public/easybuy-catalog?provider=${encodeURIComponent(selectedProvider)}`,
          { suppressErrorToast: false } as any
        );
        const data = response.data?.data;
        const models = data?.models || [];
        const nextPlanRules = data?.planRules || null;
        if (!active) return;
        setCatalog(models);
        setPlanRules(nextPlanRules);
        if (models.length) {
          const first = models[0];
          const firstCapacity = first.capacities[0] || "";
          const firstPrice = Number(first.pricesByCapacity?.[firstCapacity] || 0);
          setForm((prev) => ({
            ...prev,
            iphoneModel: first.model,
            capacity: firstCapacity,
            plan: "",
            phonePrice: firstPrice > 0 ? formatInputWithCommas(String(firstPrice)) : "",
            monthlyPlan: "",
            weeklyPlan: "",
          }));
        }
      } catch (_error) {
        if (!active) return;
        setCatalogError("Failed to load device options");
      } finally {
        if (active) setLoadingCatalog(false);
      }
    };

    loadCatalog();
    return () => {
      active = false;
    };
  }, [selectedProvider]);

  useEffect(() => {
    if (!planRules) return;

    setForm((prev) => {
      let next = prev;

      if (next.monthlyPlan && !planRules.monthlyDurations.includes(Number(next.monthlyPlan))) {
        next = { ...next, monthlyPlan: "" };
      }

      if (next.weeklyPlan && !planRules.weeklyDurations.includes(Number(next.weeklyPlan))) {
        next = { ...next, weeklyPlan: "" };
      }

      return next;
    });
  }, [planRules]);

  useEffect(() => {
    if (!selectedModel) return;

    setForm((prev) => {
      let next = prev;
      const hasValidPlan =
        !!prev.plan && selectedModel.allowedPlans.includes(prev.plan as PlanType);
      if (!hasValidPlan) {
        next = { ...next, plan: "" };
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
        if (!prev.phonePrice) return prev;
        return {
          ...prev,
          phonePrice: "",
        };
      });
      setDownPaymentTouched(false);
      return;
    }

    setForm((prev) => {
      const currentPrice = parseFormattedNumber(prev.phonePrice);
      if (currentPrice === selectedCapacityPrice) {
        return prev;
      }
      return {
        ...prev,
        phonePrice: formatInputWithCommas(String(selectedCapacityPrice)),
      };
    });
    setDownPaymentTouched(false);
  }, [form.capacity, selectedCapacityPrice, selectedModel]);

  useEffect(() => {
    if (downPaymentTouched) return;

    const minimumDownPayment = phonePriceNumber * downPaymentMultiplier;
    setForm((prev) => ({
      ...prev,
      downPayment: minimumDownPayment > 0 ? formatInputWithCommas(minimumDownPayment.toFixed(2)) : "",
    }));
  }, [downPaymentMultiplier, downPaymentTouched, phonePriceNumber]);
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
    const resolvedPlan = selectedModel?.allowedPlans.includes(form.plan as PlanType)
      ? (form.plan as PlanType)
      : "";

    if (!resolvedPlan) return 0;

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
  }, [calculatedLoanedAmount, form.monthlyPlan, form.plan, form.weeklyPlan, planRules, selectedModel]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedModel) {
      toast.error("Device options are unavailable. Try again.");
      return;
    }
    if (!form.capacity.trim()) {
      toast.error("Select a valid device capacity");
      return;
    }
    if (!form.plan || !selectedModel.allowedPlans.includes(form.plan as PlanType)) {
      toast.error("Select a valid plan type");
      return;
    }
    if (form.plan === "Weekly" && !form.weeklyPlan) {
      toast.error("Select a weekly plan duration");
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

    setSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const resolvedPlan = form.plan;
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        iphoneModel: form.iphoneModel,
        capacity: form.capacity,
        plan: resolvedPlan,
        provider: selectedProvider,
        anonymousId: getOrCreateAnonymousId(),
        referrer: document.referrer || "",
        landingPage: window.location.href,
        utmSource: urlParams.get("utm_source") || "",
        utmMedium: urlParams.get("utm_medium") || "",
        utmCampaign: urlParams.get("utm_campaign") || "",
        utmTerm: urlParams.get("utm_term") || "",
        utmContent: urlParams.get("utm_content") || "",
        website: "",
      };

      const response = await api.post("/api/v1/public/easybuy-requests", payload, {
        suppressErrorToast: false,
      } as any);
      const requestId = String(response?.data?.data?.requestId || "");
      setSubmittedRequestId(requestId);
      setContactAdminWhatsAppUrl(
        buildPublicWhatsAppUrl({
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          iphoneModel: payload.iphoneModel,
          capacity: payload.capacity,
          plan: payload.plan as "Monthly" | "Weekly",
        })
      );
      setContactAdminModalOpen(true);
      toast.success(response?.data?.message || "Request submitted. Check your email.");
      trackTikTokEvent("SubmitForm", {
        content_type: "product",
        content_name: payload.iphoneModel,
        plan: payload.plan,
        capacity: payload.capacity,
        currency: "NGN",
        value: Number.isFinite(phonePriceNumber) ? phonePriceNumber : 0,
        request_status: String(response?.data?.data?.status || "pending_verification"),
      });
      trackEvent("form_submit", {
        provider: selectedProvider,
        iphoneModel: payload.iphoneModel,
        plan: payload.plan,
        capacity: payload.capacity,
      });

      if (catalog.length) {
        const first = catalog[0];
        const firstCapacity = first.capacities[0] || "";
        const firstPrice = Number(first.pricesByCapacity?.[firstCapacity] || 0);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          iphoneModel: first.model,
          capacity: firstCapacity,
          plan: "",
          phonePrice: firstPrice > 0 ? formatInputWithCommas(String(firstPrice)) : "",
          downPayment: "",
          monthlyPlan: "",
          weeklyPlan: "",
        });
      } else {
        setForm({
          fullName: "",
          email: "",
          phone: "",
          iphoneModel: "",
          capacity: "",
          plan: "",
          phonePrice: "",
          downPayment: "",
          monthlyPlan: "",
          weeklyPlan: "",
        });
      }
      setDownPaymentTouched(false);
    } catch (_error) {
      // shared error toast already handled
    } finally {
      setSubmitting(false);
    }
  };

  const resendVerification = async () => {
    if (!submittedRequestId && !form.email.trim()) {
      toast.error("Enter your email first");
      return;
    }
    setResending(true);
    try {
      const response = await api.post(
        "/api/v1/public/easybuy-requests/resend-verification",
        {
          requestId: submittedRequestId || "",
          email: form.email.trim().toLowerCase(),
        },
        { suppressErrorToast: false } as any
      );
      toast.success(response?.data?.message || "Verification email sent");
    } catch (_error) {
      // shared error toast already handled
    } finally {
      setResending(false);
    }
  };

    return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6">
      <section className="rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-soft">
        <h1 className="text-xl font-semibold">Create EasyBuy Request</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Model and capacity options are loaded from backend catalog rules.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          No account needed. Submit your request and verify your email from your inbox.
        </p>

        {catalogError && (
          <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{catalogError}</div>
        )}

        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="provider" className="text-sm font-medium">
              Payment Provider
            </label>
            <select
              id="provider"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={selectedProvider}
              onChange={(e) => {
                const provider = e.target.value;
                setSelectedProvider(provider);
                trackEvent("provider_selected", { provider });
              }}
              disabled={loadingProviders || providers.length <= 1}
              required
            >
              {providers.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.displayName}
                </option>
              ))}
            </select>
            {providers.length <= 1 && !loadingProviders && (
              <p className="text-xs text-muted-foreground">
                Only one payment provider is currently available.
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="iphone-model" className="text-sm font-medium">
              iPhone Model
            </label>
            <select
              id="iphone-model"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.iphoneModel}
              onChange={(e) => setForm((prev) => ({ ...prev, iphoneModel: e.target.value }))}
              disabled={loadingCatalog || !catalog.length}
              required
            >
              {catalog.map((item) => (
                <option key={item.model} value={item.model}>
                  {item.model}
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
              onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
              disabled={!selectedModel || !availableCapacities.length}
              required
            >
              {availableCapacities.map((capacity) => (
                <option key={capacity} value={capacity}>
                  {capacity}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            {selectedModel && !previewUnavailable ? (
              <img
                src={selectedModel.imageUrl}
                alt={form.iphoneModel}
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
              className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                form.plan ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"
              }`}
              value={form.plan}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  plan: e.target.value ? getSafePlan(e.target.value) : "",
                }))
              }
              disabled={!selectedModel}
              required
            >
              <option value="">Select plan type</option>
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
              value={form.phonePrice}
              onChange={(e) => setForm((prev) => ({ ...prev, phonePrice: formatInputWithCommas(e.target.value) }))}
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
                setForm((prev) => ({ ...prev, downPayment: formatInputWithCommas(e.target.value) }));
              }}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum required: {formatAmount(minimumRequiredDownPayment)} ({downPaymentPercentage}% of phone price)
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
                (isWeeklyOnly ? "Weekly" : form.plan) === "Weekly"
                  ? "(Loaned + % Markup) / Weeks"
                  : "(Loaned + % Markup) / Months"
              }
              value={Number.isFinite(calculatedNextPayment) ? formatAmount(Number(calculatedNextPayment.toFixed(2))) : "0"}
              readOnly
            />
          </div>

          {form.plan === "Monthly" ? (
            <div className="space-y-2">
              <label htmlFor="monthly-plan" className="text-sm font-medium">
                Monthly Plan Duration
              </label>
              <select
                id="monthly-plan"
                className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.monthlyPlan}
                onChange={(e) => setForm((prev) => ({ ...prev, monthlyPlan: e.target.value }))}
                required
              >
                <option value="">Select monthly duration</option>
                {monthlyDurations.map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? "Month" : "Months"}
                  </option>
                ))}
              </select>
            </div>
          ) : form.plan === "Weekly" ? (
            <div className="space-y-2">
              <label htmlFor="weekly-plan" className="text-sm font-medium">
                Weekly Plan Duration
              </label>
              <select
                id="weekly-plan"
                className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                  form.weeklyPlan ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"
                }`}
                value={form.weeklyPlan}
                onChange={(e) => setForm((prev) => ({ ...prev, weeklyPlan: e.target.value }))}
                required
              >
                <option value="">Select weekly duration</option>
                {weeklyDurations.map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} Weeks
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="full-name" className="text-sm font-medium">
              Full Name
            </label>
            <input
              id="full-name"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.fullName}
              onChange={(e) => {
                if (!formStartTrackedRef.current) {
                  formStartTrackedRef.current = true;
                  trackEvent("form_start", { provider: selectedProvider });
                }
                setForm((prev) => ({ ...prev, fullName: e.target.value }));
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.email}
              onChange={(e) => {
                if (!formStartTrackedRef.current) {
                  formStartTrackedRef.current = true;
                  trackEvent("form_start", { provider: selectedProvider });
                }
                setForm((prev) => ({ ...prev, email: e.target.value }));
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.phone}
              onChange={(e) => {
                if (!formStartTrackedRef.current) {
                  formStartTrackedRef.current = true;
                  trackEvent("form_start", { provider: selectedProvider });
                }
                setForm((prev) => ({ ...prev, phone: e.target.value }));
              }}
              placeholder="e.g. +234..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              submitting ||
              loadingCatalog ||
              loadingProviders ||
              !selectedProvider ||
              !selectedModel ||
              !form.capacity ||
              !form.plan ||
              (form.plan === "Weekly" && !form.weeklyPlan) ||
              phonePriceNumber <= 0 ||
              invalidDownPayment
            }
            className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-2"
          >
            {submitting ? (
              <>
                <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                Submitting...
              </>
            ) : (
              "Create Request"
            )}
          </button>
        </form>

        {submittedRequestId && (
          <div className="mt-5 rounded-lg border border-border bg-muted p-4">
            <p className="text-sm font-medium">Request submitted</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Check your email and click the verification link to continue.
            </p>
            {contactAdminWhatsAppUrl && (
              <a href={contactAdminWhatsAppUrl} className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">Contact Admin on WhatsApp</a>
            )}
            <button
              type="button"
              onClick={resendVerification}
              disabled={resending}
              className="mt-3 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}
      </section>

      <p className="text-center text-xs text-muted-foreground">
        Admin account users can continue to{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
        .
      </p>

      {contactAdminModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              setContactAdminModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-base font-semibold">Contact Admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your request is in. You can chat with admin immediately on WhatsApp while waiting for email verification.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setContactAdminModalOpen(false)}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
              >
                Close
              </button>
              {contactAdminWhatsAppUrl && (
                <a href={contactAdminWhatsAppUrl} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">Contact Admin on WhatsApp</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
