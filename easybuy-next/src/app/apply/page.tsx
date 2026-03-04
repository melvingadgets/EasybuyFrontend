"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { FormLayout } from "@/components/apply/FormLayout";
import { StepFourReview } from "@/components/apply/steps/StepFourReview";
import { StepOneBasicInfo } from "@/components/apply/steps/StepOneBasicInfo";
import { StepTwoPlan } from "@/components/apply/steps/StepTwoPlan";
import {
  buildPublicWhatsAppUrl,
  formatInputWithCommas,
  formatAmount,
  getOrCreateAnonymousId,
  parseFormattedNumber,
} from "@/components/apply/helpers";
import type { ApplyFormState, ApplyStep, PlanType } from "@/components/apply/types";
import { api } from "@/lib/api";
import { initializeTikTokPixel, trackTikTokEvent, trackTikTokPageView } from "@/lib/tiktokPixel";
import type { EasyBuyCatalogResponse } from "@/types/easybuy";

type PublicCatalogResponse = {
  message: string;
  data?: EasyBuyCatalogResponse;
};

const DRAFT_KEY = "easybuy_next_apply_draft_v1";

const initialFormState: ApplyFormState = {
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
};

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

const normalizeStep = (step: unknown): ApplyStep => {
  const numeric = Number(step);
  if (numeric === 2 || numeric === 3) return numeric;
  return 1;
};

export default function ApplyPage() {
  const pixelPageTrackedRef = useRef(false);
  const [draftReady, setDraftReady] = useState(false);
  const [step, setStep] = useState<ApplyStep>(1);

  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [catalog, setCatalog] = useState<EasyBuyCatalogResponse["models"]>([]);
  const [planRules, setPlanRules] = useState<EasyBuyCatalogResponse["planRules"] | null>(null);
  const [catalogError, setCatalogError] = useState("");

  const [submittedRequestId, setSubmittedRequestId] = useState("");

  const [contactAdminModalOpen, setContactAdminModalOpen] = useState(false);
  const [contactAdminWhatsAppUrl, setContactAdminWhatsAppUrl] = useState("");

  const [downPaymentTouched, setDownPaymentTouched] = useState(false);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);

  const [basicErrors, setBasicErrors] = useState<Partial<Record<"fullName" | "email" | "phone", string>>>({});

  const [form, setForm] = useState<ApplyFormState>(initialFormState);

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

  const downPaymentPercentage = useMemo(() => {
    const raw = Number(selectedModel?.downPaymentPercentage);
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }, [selectedModel?.downPaymentPercentage]);

  const downPaymentMultiplier = downPaymentPercentage / 100;

  const hasPlanAndDuration = useMemo(() => {
    if (!form.plan) return false;
    if (form.plan === "Monthly") return !!form.monthlyPlan;
    if (form.plan === "Weekly") return !!form.weeklyPlan;
    return false;
  }, [form.monthlyPlan, form.plan, form.weeklyPlan]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form && typeof parsed.form === "object") {
          setForm({ ...initialFormState, ...parsed.form });
        }
        if (parsed?.step) {
          setStep(normalizeStep(parsed.step));
        }
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    initializeTikTokPixel();
    if (pixelPageTrackedRef.current) return;
    trackTikTokPageView();
    pixelPageTrackedRef.current = true;
  }, []);

  useEffect(() => {
    let active = true;

    const loadCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const response = await api.get<PublicCatalogResponse>("/api/v1/public/easybuy-catalog", {
          suppressErrorToast: false,
        } as any);

        const data = response.data?.data;
        const models = data?.models || [];
        const nextPlanRules = data?.planRules || null;
        if (!active) return;

        setCatalog(models);
        setPlanRules(nextPlanRules);

        if (models.length) {
          setForm((prev) => {
            const found = models.find((item) => item.model === prev.iphoneModel);
            const model = found || models[0];
            const nextCapacity = model.capacities.includes(prev.capacity) ? prev.capacity : model.capacities[0] || "";
            const safePlan = prev.plan && model.allowedPlans.includes(prev.plan as PlanType) ? prev.plan : "";
            const safePrice = Number(model.pricesByCapacity?.[nextCapacity] || 0);

            return {
              ...prev,
              iphoneModel: model.model,
              capacity: nextCapacity,
              plan: safePlan,
              monthlyPlan: safePlan === "Monthly" ? prev.monthlyPlan : "",
              weeklyPlan: safePlan === "Weekly" ? prev.weeklyPlan : "",
              phonePrice: safePrice > 0 ? formatInputWithCommas(String(safePrice)) : "",
            };
          });
        }
      } catch {
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
  }, []);

  useEffect(() => {
    if (!draftReady) return;

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        step,
        form,
      })
    );
  }, [draftReady, form, step]);

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

      const hasValidPlan = prev.plan && selectedModel.allowedPlans.includes(prev.plan as PlanType);
      if (!hasValidPlan) {
        next = { ...next, plan: "", monthlyPlan: "", weeklyPlan: "" };
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

    if (!hasPlanAndDuration) {
      setForm((prev) => (prev.downPayment ? { ...prev, downPayment: "" } : prev));
      return;
    }

    const phonePrice = parseFormattedNumber(form.phonePrice);
    const minimumDownPayment = phonePrice * downPaymentMultiplier;
    setForm((prev) => ({
      ...prev,
      downPayment: minimumDownPayment > 0 ? formatInputWithCommas(minimumDownPayment.toFixed(2)) : "",
    }));
  }, [downPaymentMultiplier, downPaymentTouched, form.phonePrice, hasPlanAndDuration]);

  const phonePriceNumber = useMemo(() => parseFormattedNumber(form.phonePrice), [form.phonePrice]);

  const minimumRequiredDownPayment = useMemo(
    () => (hasPlanAndDuration ? phonePriceNumber * downPaymentMultiplier : 0),
    [downPaymentMultiplier, hasPlanAndDuration, phonePriceNumber]
  );

  const calculatedDownPayment = useMemo(() => parseFormattedNumber(form.downPayment), [form.downPayment]);

  const downPaymentTooLow = useMemo(
    () => hasPlanAndDuration && calculatedDownPayment < minimumRequiredDownPayment && phonePriceNumber > 0,
    [calculatedDownPayment, hasPlanAndDuration, minimumRequiredDownPayment, phonePriceNumber]
  );

  const downPaymentAbovePhonePrice = useMemo(
    () => hasPlanAndDuration && calculatedDownPayment > phonePriceNumber && phonePriceNumber > 0,
    [calculatedDownPayment, hasPlanAndDuration, phonePriceNumber]
  );

  const invalidDownPayment = useMemo(
    () => (hasPlanAndDuration ? calculatedDownPayment <= 0 || downPaymentTooLow || downPaymentAbovePhonePrice : false),
    [calculatedDownPayment, downPaymentAbovePhonePrice, downPaymentTooLow, hasPlanAndDuration]
  );

  const calculatedLoanedAmount = useMemo(
    () => (hasPlanAndDuration ? Math.max(phonePriceNumber - calculatedDownPayment, 0) : 0),
    [calculatedDownPayment, hasPlanAndDuration, phonePriceNumber]
  );

  const calculatedNextPayment = useMemo(() => {
    const resolvedPlan = selectedModel?.allowedPlans.includes(form.plan as PlanType) ? (form.plan as PlanType) : "";

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

  const setField = (field: keyof ApplyFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const applyFormPatch = (patch: Partial<ApplyFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const validateStepOne = () => {
    const nextErrors: Partial<Record<"fullName" | "email" | "phone", string>> = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Use a valid email address";
    }

    const phoneOnlyDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (phoneOnlyDigits.length < 10) {
      nextErrors.phone = "Phone number looks too short";
    }

    setBasicErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      toast.error("Complete your basic info before continuing");
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    if (!selectedModel) {
      toast.error("Device options are unavailable. Try again.");
      return false;
    }

    if (!form.capacity.trim()) {
      toast.error("Select a valid device capacity");
      return false;
    }

    if (!form.plan || !selectedModel.allowedPlans.includes(form.plan as PlanType)) {
      toast.error("Select a valid plan type");
      return false;
    }

    if (form.plan === "Monthly" && !form.monthlyPlan) {
      toast.error("Select a monthly plan duration");
      return false;
    }

    if (form.plan === "Weekly" && !form.weeklyPlan) {
      toast.error("Select a weekly plan duration");
      return false;
    }

    if (phonePriceNumber <= 0) {
      toast.error("Enter a valid phone price greater than zero");
      return false;
    }

    if (invalidDownPayment) {
      if (downPaymentTooLow) {
        toast.error(`Down payment cannot be below ${formatAmount(minimumRequiredDownPayment)} for this model`);
      } else if (downPaymentAbovePhonePrice) {
        toast.error("Down payment cannot be greater than the phone price");
      } else {
        toast.error("Enter a valid down payment");
      }
      return false;
    }

    return true;
  };

  const validateCurrentStep = () => {
    if (step === 1) return validateStepOne();
    if (step === 2) return validateStepTwo();
    return validateStepOne() && validateStepTwo();
  };

  const saveDraftStep = (targetStep: 1 | 2) => {
    const urlParams = new URLSearchParams(window.location.search);
    const payload: Record<string, unknown> = {
      step: targetStep,
      anonymousId: getOrCreateAnonymousId(),
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      iphoneModel: form.iphoneModel,
      capacity: form.capacity,
      plan: form.plan,
      monthlyPlan: form.monthlyPlan,
      weeklyPlan: form.weeklyPlan,
      referrer: document.referrer || "",
      landingPage: window.location.href,
      utmSource: urlParams.get("utm_source") || "",
      utmMedium: urlParams.get("utm_medium") || "",
      utmCampaign: urlParams.get("utm_campaign") || "",
      utmTerm: urlParams.get("utm_term") || "",
      utmContent: urlParams.get("utm_content") || "",
      website: "",
    };

    api.post("/api/v1/public/easybuy-drafts/step", payload, {
      suppressErrorToast: true,
    } as any).catch(() => {
      // Background save only. Do not block step navigation.
    });
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;

    if (step === 1 || step === 2) {
      saveDraftStep(step);
    }

    setStep((prev) => {
      if (prev === 1) return 2;
      if (prev === 2) return 3;
      return 3;
    });
  };

  const goBack = () => {
    setStep((prev) => {
      if (prev === 3) return 2;
      if (prev === 2) return 1;
      return 1;
    });
  };

  const submitRequest = async () => {
    if (!(validateStepOne() && validateStepTwo())) {
      return;
    }

    setSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        iphoneModel: form.iphoneModel,
        capacity: form.capacity,
        plan: form.plan,
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

      toast.success("Request submitted successfully.");
      trackTikTokEvent("SubmitForm", {
        content_type: "product",
        content_name: payload.iphoneModel,
        plan: payload.plan,
        capacity: payload.capacity,
        currency: "NGN",
        value: Number.isFinite(phonePriceNumber) ? phonePriceNumber : 0,
        request_status: String(response?.data?.data?.status || "verified"),
      });

      if (catalog.length) {
        const first = catalog[0];
        const firstCapacity = first.capacities[0] || "";
        const firstPrice = Number(first.pricesByCapacity?.[firstCapacity] || 0);

        setForm({
          ...initialFormState,
          iphoneModel: first.model,
          capacity: firstCapacity,
          phonePrice: firstPrice > 0 ? formatInputWithCommas(String(firstPrice)) : "",
        });
      } else {
        setForm(initialFormState);
      }

      setBasicErrors({});
      setStep(1);
      setDownPaymentTouched(false);
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // shared error toast via axios interceptor
    } finally {
      setSubmitting(false);
    }
  };


  
  const stepView = useMemo(() => {
    if (step === 1) {
      return <StepOneBasicInfo form={form} errors={basicErrors} onChange={setField} />;
    }

    if (step === 2) {
      return (
        <StepTwoPlan
          form={form}
          catalog={catalog}
          loadingCatalog={loadingCatalog}
          selectedModel={selectedModel}
          availableCapacities={availableCapacities}
          monthlyDurations={monthlyDurations}
          weeklyDurations={weeklyDurations}
          previewUnavailable={previewUnavailable}
          downPaymentPercentage={downPaymentPercentage}
          minimumRequiredDownPayment={minimumRequiredDownPayment}
          calculatedNextPayment={calculatedNextPayment}
          downPaymentTooLow={downPaymentTooLow}
          downPaymentAbovePhonePrice={downPaymentAbovePhonePrice}
          hasPlanAndDuration={hasPlanAndDuration}
          onFormChange={applyFormPatch}
          onModelChange={(model) => {
            setPreviewUnavailable(false);
            applyFormPatch({ iphoneModel: model, plan: "", monthlyPlan: "", weeklyPlan: "" });
          }}
          onPhonePriceChange={(value) => applyFormPatch({ phonePrice: formatInputWithCommas(value) })}
          onDownPaymentChange={(value) => {
            setDownPaymentTouched(true);
            applyFormPatch({ downPayment: formatInputWithCommas(value) });
          }}
          onPreviewUnavailable={() => setPreviewUnavailable(true)}
        />
      );
    }

    return (
      <StepFourReview
        form={form}
        downPaymentPercentage={downPaymentPercentage}
        minimumRequiredDownPayment={minimumRequiredDownPayment}
        calculatedNextPayment={calculatedNextPayment}
      />
    );
  }, [
    availableCapacities,
    basicErrors,
    calculatedNextPayment,
    catalog,
    downPaymentAbovePhonePrice,
    downPaymentPercentage,
    downPaymentTooLow,
    hasPlanAndDuration,
    form,
    loadingCatalog,
    minimumRequiredDownPayment,
    monthlyDurations,
    previewUnavailable,
    selectedModel,
    step,
    weeklyDurations,
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6">
      <FormLayout step={step}>
        {catalogError ? (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{catalogError}</div>
        ) : null}

        {stepView}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1 || submitting}
            className="rounded-md border border-border bg-background px-4 py-2.5 text-base hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={submitting || loadingCatalog}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submitRequest}
              disabled={submitting || loadingCatalog}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <ClipLoader color="hsl(var(--primary-foreground))" size={16} speedMultiplier={0.9} />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          )}
        </div>

        {submittedRequestId ? (
          <div className="mt-5 rounded-lg border border-border bg-muted p-4">
            <p className="text-sm font-medium">Request submitted</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Your request has been received. Admin review starts immediately.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {contactAdminWhatsAppUrl ? (
                <a href={contactAdminWhatsAppUrl} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">Contact Melvin Gadgets on WhatsApp</a>
              ) : null}

            </div>
          </div>
        ) : null}
      </FormLayout>




      {contactAdminModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              setContactAdminModalOpen(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-soft">
            <h2 className="font-heading text-xl font-semibold">Contact Melvin Gadgets</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-semibold text-foreground">
                Please get your 3 months bank statement and NIN ready.
              </p>
              <p className="font-bold text-foreground">
                Melvin Gadgets will contact you soon.
              </p>
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-extrabold text-red-800">
                Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the phone.
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setContactAdminModalOpen(false)}
                className="rounded-md border border-border bg-background px-3 py-2 text-base hover:bg-muted"
              >
                Close
              </button>
              {contactAdminWhatsAppUrl ? (
                <a href={contactAdminWhatsAppUrl} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60">Contact Melvin Gadgets on WhatsApp</a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

















