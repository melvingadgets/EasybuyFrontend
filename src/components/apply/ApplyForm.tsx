import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import { FormLayout } from "./FormLayout";
import { MyApplications } from "./MyApplications";
import { StepFourReview } from "./steps/StepFourReview";
import { StepOneBasicInfo } from "./steps/StepOneBasicInfo";
import { StepTwoPlan } from "./steps/StepTwoPlan";
import { buildPublicWhatsAppUrl, formatAmount, formatInputWithCommas, getOrCreateAnonymousId, parseFormattedNumber } from "./helpers";
import { saveDocumentsSession } from "../../lib/documentsSession";
import type { ApplyFormState, ApplyStep, PlanType } from "./types";
import { trackEvent } from "../../lib/analytics";
import { getMelvinBridgeUser, onMelvinAuthChange } from "../../lib/melvinBridge";
import { initializeTikTokPixel, trackTikTokEvent, trackTikTokPageView } from "../../lib/tiktokPixel";
import {
  useCreatePublicEasyBuyRequestMutation,
  useGetPublicEasyBuyCatalogQuery,
  useGetPublicProvidersQuery,
  useSavePublicEasyBuyDraftStepMutation,
} from "../../store/api/backendApi";
import type { EasyBuyCatalogResponse, EasyBuyServiceFeeRule } from "../../types/api";

// The application form, ported from the standalone Apply app (easybuy-next). It runs anonymously:
// no account is needed to browse, fill in or submit. Signing in is only required afterwards, to
// add documents, which is why submitting hands off to /apply/documents behind the login wall.
//
// The draft key is the standalone app's, on purpose: an applicant who started there and comes back
// through this app finds their half-finished form waiting.

const DRAFT_KEY = "easybuy_next_apply_draft_v1";
const FALLBACK_PROVIDER = "aurapay";

const getFirstPricedCapacity = (model: EasyBuyCatalogResponse["models"][number] | null) =>
  model?.capacities.find((capacity) => {
    const price = Number(model.pricesByCapacity?.[capacity]);
    return Number.isFinite(price) && price > 0;
  }) ||
  model?.capacities[0] ||
  "";

const getDefaultCatalogModel = (models: EasyBuyCatalogResponse["models"]) =>
  models.find((model) =>
    model.capacities.some((capacity) => {
      const price = Number(model.pricesByCapacity?.[capacity]);
      return Number.isFinite(price) && price > 0;
    })
  ) ||
  models[0] ||
  null;

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

export function ApplyForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pixelPageTrackedRef = useRef(false);
  const formStartTrackedRef = useRef(false);

  const [draftReady, setDraftReady] = useState(false);
  const [step, setStep] = useState<ApplyStep>(() => normalizeStep(searchParams.get("step")));
  const [modelExplicitlySelected, setModelExplicitlySelected] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [downPaymentTouched, setDownPaymentTouched] = useState(false);
  const [previewUnavailable, setPreviewUnavailable] = useState(false);
  const [basicErrors, setBasicErrors] = useState<Partial<Record<"fullName" | "email" | "phone", string>>>({});
  const [form, setForm] = useState<ApplyFormState>(initialFormState);
  const [contactAdminModalOpen, setContactAdminModalOpen] = useState(false);
  const [contactAdminWhatsAppUrl, setContactAdminWhatsAppUrl] = useState("");

  // The provider picker is gone from the form, but the catalog is still served per provider, so
  // the applicant gets the server's first provider. The catalog query waits for it.
  const { data: providersData } = useGetPublicProvidersQuery();
  const selectedProvider = providersData?.data?.[0]?.slug || FALLBACK_PROVIDER;

  const { data: catalogData, isFetching: loadingCatalog, isError: catalogFailed } = useGetPublicEasyBuyCatalogQuery(selectedProvider);

  const catalog = catalogData?.data?.models || [];
  const planRules = catalogData?.data?.planRules || null;
  const serviceFee: EasyBuyServiceFeeRule | null = catalogData?.data?.serviceFee || null;

  // Resolve the applicant's saved model against a freshly loaded catalog: keep what still exists,
  // otherwise fall back to a model that has a price, so step 2 is never empty.
  const catalogAppliedRef = useRef<EasyBuyCatalogResponse["models"] | null>(null);
  useEffect(() => {
    if (!catalog.length || catalogAppliedRef.current === catalog) return;
    catalogAppliedRef.current = catalog;

    setForm((prev) => {
      const found = catalog.find((item) => item.model === prev.iphoneModel);
      const resolvedModel = found || getDefaultCatalogModel(catalog);
      if (!resolvedModel) {
        return { ...prev, iphoneModel: "", capacity: "", plan: "", monthlyPlan: "", weeklyPlan: "", phonePrice: "", downPayment: "" };
      }

      const nextCapacity = resolvedModel.capacities.includes(prev.capacity) ? prev.capacity : getFirstPricedCapacity(resolvedModel);
      const safePlan = prev.plan && resolvedModel.allowedPlans.includes(prev.plan as PlanType) ? prev.plan : "";
      const safePrice = nextCapacity ? Number(resolvedModel.pricesByCapacity?.[nextCapacity] || 0) : 0;

      return {
        ...prev,
        iphoneModel: resolvedModel.model,
        capacity: nextCapacity,
        plan: safePlan,
        monthlyPlan: safePlan === "Monthly" ? prev.monthlyPlan : "",
        weeklyPlan: safePlan === "Weekly" ? prev.weeklyPlan : "",
        phonePrice: safePrice > 0 ? formatInputWithCommas(String(safePrice)) : prev.phonePrice,
      };
    });
  }, [catalog]);

  const selectedModel = useMemo(() => catalog.find((item) => item.model === form.iphoneModel) || null, [catalog, form.iphoneModel]);

  const availableCapacities = selectedModel?.capacities || [];
  const monthlyDurations = planRules?.monthlyDurations || [];
  const weeklyDurations = planRules?.weeklyDurations || [];

  const selectedCapacityPrice = useMemo(() => {
    if (!selectedModel || !form.capacity) return 0;
    const rawPrice = Number(selectedModel.pricesByCapacity?.[form.capacity]);
    return Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : 0;
  }, [selectedModel, form.capacity]);

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
      return Number.isFinite(thresholdPercentage) && thresholdPercentage > 0 ? thresholdPercentage : 0;
    }

    const raw = Number(selectedModel?.downPaymentPercentage);
    return Number.isFinite(raw) && raw > 0 ? raw : 0;
  }, [phonePriceNumber, planRules?.downPaymentRule, selectedModel?.downPaymentPercentage]);

  const downPaymentMultiplier = downPaymentPercentage / 100;

  const hasPlanAndDuration = useMemo(() => {
    if (form.plan === "Monthly") return !!form.monthlyPlan;
    if (form.plan === "Weekly") return !!form.weeklyPlan;
    return false;
  }, [form.monthlyPlan, form.plan, form.weeklyPlan]);

  // Restore the draft once, then start persisting it.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.form && typeof parsed.form === "object") {
          const isModelExplicit = Boolean(parsed?.modelExplicitlySelected);
          const nextForm = { ...initialFormState, ...parsed.form } as ApplyFormState;

          // Without an explicit model choice the device fields are re-resolved from the catalog,
          // so a draft can't pin a stale model or a price from an old catalog.
          if (!isModelExplicit) {
            nextForm.iphoneModel = "";
            nextForm.capacity = "";
            nextForm.plan = "";
            nextForm.monthlyPlan = "";
            nextForm.weeklyPlan = "";
            nextForm.phonePrice = "";
            nextForm.downPayment = "";
          }

          setForm(nextForm);
          setModelExplicitlySelected(isModelExplicit);
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
    trackEvent("page_view");
    pixelPageTrackedRef.current = true;
  }, []);

  useEffect(() => {
    if (!draftReady) return;

    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          step,
          form,
          modelExplicitlySelected,
          selectedProvider,
        })
      );
    } catch {
      // A full or blocked localStorage only costs the applicant their draft.
    }
  }, [draftReady, form, modelExplicitlySelected, selectedProvider, step]);

  useEffect(() => {
    if (!planRules) return;

    setForm((prev) => {
      let next = prev;
      if (next.monthlyPlan && !planRules.monthlyDurations.includes(Number(next.monthlyPlan))) next = { ...next, monthlyPlan: "" };
      if (next.weeklyPlan && !planRules.weeklyDurations.includes(Number(next.weeklyPlan))) next = { ...next, weeklyPlan: "" };
      return next;
    });
  }, [planRules]);

  useEffect(() => {
    if (!selectedModel) return;

    setForm((prev) => {
      let next = prev;
      const hasValidPlan = prev.plan && selectedModel.allowedPlans.includes(prev.plan as PlanType);
      if (!hasValidPlan) next = { ...next, plan: "", monthlyPlan: "", weeklyPlan: "" };
      if (!selectedModel.capacities.includes(next.capacity)) next = { ...next, capacity: selectedModel.capacities[0] || "" };
      return next;
    });
  }, [selectedModel]);

  useEffect(() => {
    setPreviewUnavailable(false);
  }, [selectedModel?.imageUrl]);

  useEffect(() => {
    if (!selectedModel || !form.capacity) return;

    if (selectedCapacityPrice <= 0) {
      setForm((prev) => (prev.phonePrice ? { ...prev, phonePrice: "" } : prev));
      setDownPaymentTouched(false);
      return;
    }

    setForm((prev) => (parseFormattedNumber(prev.phonePrice) === selectedCapacityPrice ? prev : { ...prev, phonePrice: formatInputWithCommas(String(selectedCapacityPrice)) }));
    setDownPaymentTouched(false);
  }, [form.capacity, selectedCapacityPrice, selectedModel]);

  useEffect(() => {
    if (downPaymentTouched) return;

    if (!hasPlanAndDuration) {
      setForm((prev) => (prev.downPayment ? { ...prev, downPayment: "" } : prev));
      return;
    }

    const minimumDownPayment = phonePriceNumber * downPaymentMultiplier;
    setForm((prev) => ({ ...prev, downPayment: minimumDownPayment > 0 ? formatInputWithCommas(minimumDownPayment.toFixed(2)) : "" }));
  }, [downPaymentMultiplier, downPaymentTouched, hasPlanAndDuration, phonePriceNumber]);

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
      if (months <= 0) return 0;
      const multiplier = planRules?.monthlyMarkupMultipliers[String(months)] || 1;
      return (calculatedLoanedAmount * multiplier) / months;
    }

    const weeks = Number(form.weeklyPlan) || 0;
    if (weeks <= 0) return 0;
    const multiplier = planRules?.weeklyMarkupMultipliers[String(weeks)] || 1;
    return (calculatedLoanedAmount * multiplier) / weeks;
  }, [calculatedLoanedAmount, form.monthlyPlan, form.plan, form.weeklyPlan, planRules, selectedModel]);

  // The EasyBuy service charge, shown before applying (Shortwork/RESELLER-PLAN.md §8b). Display
  // only: EasyBuy computes the real amount, in kobo, when the request is converted.
  const serviceCharge = useMemo(() => {
    if (!serviceFee || !hasPlanAndDuration) return null;
    const base = serviceFee.base === "price" ? phonePriceNumber : calculatedLoanedAmount;
    const amount = Math.round(base * serviceFee.bps) / 10_000;
    return {
      amount,
      percent: serviceFee.bps / 100,
      onFinancedAmount: serviceFee.base === "financed",
      dueAtCollection: calculatedDownPayment + amount,
    };
  }, [calculatedDownPayment, calculatedLoanedAmount, hasPlanAndDuration, phonePriceNumber, serviceFee]);

  // Inside Melvin OS, a signed-in person's name and email are prefilled from the OS session. Only
  // empty fields are filled; nothing the applicant typed is overwritten.
  useEffect(() => {
    const prefill = () => {
      const user = getMelvinBridgeUser();
      if (!user) return;
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        email: prev.email || user.email || "",
      }));
    };
    prefill();
    return onMelvinAuthChange(prefill);
  }, []);

  const setField = (field: keyof ApplyFormState, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const applyFormPatch = (patch: Partial<ApplyFormState>) => setForm((prev) => ({ ...prev, ...patch }));

  const handleFormStart = () => {
    if (formStartTrackedRef.current) return;
    formStartTrackedRef.current = true;
    trackEvent("form_start", { provider: selectedProvider });
  };

  const validateStepOne = () => {
    const nextErrors: Partial<Record<"fullName" | "email" | "phone", string>> = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";

    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!isValidEmail(form.email)) nextErrors.email = "Use a valid email address";

    const phoneOnlyDigits = form.phone.replace(/\D/g, "");
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required";
    else if (phoneOnlyDigits.length < 10) nextErrors.phone = "Phone number looks too short";

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
      if (downPaymentTooLow) toast.error(`Down payment cannot be below ${formatAmount(minimumRequiredDownPayment)} for this model`);
      else if (downPaymentAbovePhonePrice) toast.error("Down payment cannot be greater than the phone price");
      else toast.error("Enter a valid down payment");
      return false;
    }
    return true;
  };

  const validateCurrentStep = () => {
    if (step === 1) return validateStepOne();
    if (step === 2) return validateStepTwo();
    return validateStepOne() && validateStepTwo();
  };

  const attribution = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
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
  };

  const [saveDraftStep] = useSavePublicEasyBuyDraftStepMutation();
  const [createRequest] = useCreatePublicEasyBuyRequestMutation();

  const persistDraftStep = (targetStep: 1 | 2) => {
    // Background only: a failed draft save must never block the applicant's next step.
    saveDraftStep({
      ...attribution(),
      step: targetStep,
      provider: selectedProvider,
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      iphoneModel: form.iphoneModel,
      capacity: form.capacity,
      plan: form.plan,
      monthlyPlan: form.monthlyPlan,
      weeklyPlan: form.weeklyPlan,
    }).catch(() => undefined);
  };

  const goToStep = (next: ApplyStep) => {
    setStep(next);

    // The step lives in the URL so a reload lands where the applicant left off, and Back works.
    const params = new URLSearchParams(window.location.search);
    if (next === 1) params.delete("step");
    else params.set("step", String(next));
    setSearchParams(params, { replace: true });
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;

    if (step === 1 || step === 2) {
      persistDraftStep(step);
      trackEvent("step_complete", { step, provider: selectedProvider });
    }

    goToStep(step === 1 ? 2 : 3);
  };

  const goBack = () => goToStep(step === 3 ? 2 : 1);

  const submitRequest = async () => {
    if (!(validateStepOne() && validateStepTwo())) return;

    const payload = {
      ...attribution(),
      provider: selectedProvider,
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      iphoneModel: form.iphoneModel,
      capacity: form.capacity,
      plan: form.plan,
    };

    const whatsAppUrl = buildPublicWhatsAppUrl({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      iphoneModel: payload.iphoneModel,
      capacity: payload.capacity,
      plan: payload.plan as "Monthly" | "Weekly",
    });

    setSubmitting(true);
    try {
      // No explicit Authorization header: the shared client already attaches whichever token is
      // live (the Melvin OS one inside the OS, this app's own after a normal sign-in), and EasyBuy
      // links the request to that person. Anonymous visitors simply send none.
      const response = await createRequest(payload).unwrap();

      const requestId = String(response?.data?.requestId || "");
      const documentsToken = String(response?.data?.documentsToken || "");
      setContactAdminWhatsAppUrl(whatsAppUrl);

      toast.success("Request submitted successfully.");
      trackTikTokEvent("SubmitForm", {
        content_type: "product",
        content_name: payload.iphoneModel,
        plan: payload.plan,
        capacity: payload.capacity,
        currency: "NGN",
        value: Number.isFinite(phonePriceNumber) ? phonePriceNumber : 0,
        request_status: String(response?.data?.status || "verified"),
      });
      trackEvent("form_submit", {
        provider: selectedProvider,
        iphoneModel: payload.iphoneModel,
        plan: payload.plan,
        capacity: payload.capacity,
      });

      localStorage.removeItem(DRAFT_KEY);

      if (requestId && documentsToken) {
        // Next: the bank statement, NIN and NIN photograph, which EasyBuy needs before approving.
        // The session is saved on this device first, so the hand-off survives the sign-in detour:
        // /apply/documents sits behind the login wall and bounces here through /login?returnTo=…
        saveDocumentsSession({
          requestId,
          documentsToken,
          downPaymentNaira: parseFormattedNumber(form.downPayment) || undefined,
          whatsAppUrl,
          savedAt: Date.now(),
        });
        navigate("/apply/documents");
        return;
      }

      // No documents key came back: the request still exists, but the applicant can't attach
      // documents themselves, so hand them to a person instead of a dead end.
      setContactAdminModalOpen(true);
    } catch (error: any) {
      const statusCode = Number(error?.status || error?.response?.status || 0);

      if (statusCode === 409) {
        setContactAdminWhatsAppUrl(whatsAppUrl);
        setContactAdminModalOpen(true);
        toast.error("You already have an active request for this device. Contact Melvin Gadgets on WhatsApp.");
        return;
      }

      const message = error?.data?.message || error?.data?.error || error?.message || "Unable to submit request right now. Please try again.";
      toast.error(String(message));
    } finally {
      setSubmitting(false);
    }
  };

  const stepView = useMemo(() => {
    if (step === 1) {
      return <StepOneBasicInfo form={form} errors={basicErrors} onChange={setField} onFirstInteraction={handleFormStart} />;
    }

    if (step === 2) {
      return (
        <StepTwoPlan
          form={form}
          catalog={catalog}
          loadingCatalog={!catalog.length && loadingCatalog}
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
            setModelExplicitlySelected(Boolean(model));
            applyFormPatch({ iphoneModel: model, plan: "", monthlyPlan: "", weeklyPlan: "" });
          }}
          onPhonePriceChange={(value) => applyFormPatch({ phonePrice: formatInputWithCommas(value) })}
          onDownPaymentChange={(value) => {
            setDownPaymentTouched(true);
            applyFormPatch({ downPayment: formatInputWithCommas(value) });
          }}
          onPreviewUnavailable={() => setPreviewUnavailable(true)}
          serviceCharge={serviceCharge}
        />
      );
    }

    return (
      <StepFourReview
        form={form}
        providerName={selectedProvider}
        downPaymentPercentage={downPaymentPercentage}
        minimumRequiredDownPayment={minimumRequiredDownPayment}
        calculatedNextPayment={calculatedNextPayment}
        serviceCharge={serviceCharge}
      />
    );
  }, [
    serviceCharge,
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
    selectedProvider,
    step,
    weeklyDurations,
  ]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-6">
      <FormLayout step={step}>
        {catalogFailed ? (
          <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            Couldn&apos;t load the device options. Check your connection and reload the page.
          </div>
        ) : null}

        {/* Only on the first step: an applicant this far along doesn't need their other
            applications in the way. It hides itself when not signed in. */}
        {step === 1 ? <MyApplications /> : null}

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
              disabled={submitting || (!catalog.length && loadingCatalog)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-base font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submitRequest}
              disabled={submitting || (!catalog.length && loadingCatalog)}
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
      </FormLayout>

      {contactAdminModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={(event) => {
            if (event.currentTarget === event.target) setContactAdminModalOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-soft">
            <h2 className="text-xl font-semibold">Contact Melvin Gadgets</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="font-semibold text-foreground">
                You&apos;ll need your last 3 months&apos; bank statement (with your down payment already in the account), your
                NIN, and a photo of you holding your NIN.
              </p>
              <p className="font-bold text-foreground">Melvin Gadgets will contact you soon.</p>
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-extrabold text-red-800">
                Melvin Gadgets does not receive payment in advance. Complete payment only after physical confirmation of the
                phone.
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
                <a
                  href={contactAdminWhatsAppUrl}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-base font-medium text-primary-foreground hover:opacity-90"
                >
                  Contact Melvin Gadgets on WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
