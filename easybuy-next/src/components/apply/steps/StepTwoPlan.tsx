import type { ApplyFormState } from "@/components/apply/types";
import type { EasyBuyCatalogItem, FinanceProviderInfo } from "@/types/easybuy";
import { formatAmount, getSafePlan } from "@/components/apply/helpers";

type StepTwoPlanProps = {
  form: ApplyFormState;
  providers: FinanceProviderInfo[];
  selectedProvider: string;
  loadingProviders: boolean;
  catalog: EasyBuyCatalogItem[];
  loadingCatalog: boolean;
  selectedModel: EasyBuyCatalogItem | null;
  availableCapacities: string[];
  monthlyDurations: number[];
  weeklyDurations: number[];
  previewUnavailable: boolean;
  downPaymentPercentage: number;
  minimumRequiredDownPayment: number;
  calculatedNextPayment: number;
  downPaymentTooLow: boolean;
  downPaymentAbovePhonePrice: boolean;
  hasPlanAndDuration: boolean;
  onProviderChange: (provider: string) => void;
  onFormChange: (patch: Partial<ApplyFormState>) => void;
  onModelChange: (model: string) => void;
  onPhonePriceChange: (value: string) => void;
  onDownPaymentChange: (value: string) => void;
  onPreviewUnavailable: () => void;
};

const inputBase = "w-full rounded-md border bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2";

export function StepTwoPlan({
  form,
  providers,
  selectedProvider,
  loadingProviders,
  catalog,
  loadingCatalog,
  selectedModel,
  availableCapacities,
  monthlyDurations,
  weeklyDurations,
  previewUnavailable,
  downPaymentPercentage,
  minimumRequiredDownPayment,
  calculatedNextPayment,
  downPaymentTooLow,
  downPaymentAbovePhonePrice,
  hasPlanAndDuration,
  onProviderChange,
  onFormChange,
  onModelChange,
  onPhonePriceChange,
  onDownPaymentChange,
  onPreviewUnavailable,
}: StepTwoPlanProps) {
  const isMonthly = form.plan === "Monthly";
  const isWeekly = form.plan === "Weekly";
  const selectedDuration = isMonthly ? form.monthlyPlan : isWeekly ? form.weeklyPlan : "";
  const durationHasValue = !!selectedDuration;
  const durationLabel = isWeekly ? "Weekly Plan Duration" : isMonthly ? "Monthly Plan Duration" : "Plan Duration";
  const durationPlaceholder = isWeekly
    ? "Select weekly duration"
    : isMonthly
      ? "Select monthly duration"
      : "Select plan type first";

  return (
    <div className="space-y-5 step-enter">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="provider" className="text-sm font-medium">
            Payment Provider
          </label>
          <select
            id="provider"
            className={`${inputBase} border-input focus:ring-ring`}
            value={selectedProvider}
            onChange={(e) => onProviderChange(e.target.value)}
            disabled={loadingProviders || !providers.length}
          >
            {providers.map((provider) => (
              <option key={provider.slug} value={provider.slug}>
                {provider.displayName}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground">
            {providers.length > 1
              ? "Choose the provider to see the right plan and down payment rules."
              : "Only one payment provider is currently available."}
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="iphone-model" className="text-sm font-medium">
            iPhone Model
          </label>
          <select
            id="iphone-model"
            className={`${inputBase} ${form.iphoneModel ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"}`}
            value={form.iphoneModel}
            onChange={(e) => onModelChange(e.target.value)}
            disabled={loadingCatalog || !catalog.length}
          >
            <option value="">Select iPhone model</option>
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
            className={`${inputBase} border-input focus:ring-ring`}
            value={form.capacity}
            onChange={(e) => onFormChange({ capacity: e.target.value })}
            disabled={!selectedModel || !availableCapacities.length}
          >
            {availableCapacities.map((capacity) => (
              <option key={capacity} value={capacity}>
                {capacity}
              </option>
            ))}
          </select>

          <div className="space-y-2 pt-3">
            <label htmlFor="phone-price" className="text-sm font-medium">
              Phone Price (NGN)
            </label>
            <input
              id="phone-price"
              className={`${inputBase} border-input focus:ring-ring`}
              type="text"
              inputMode="decimal"
              placeholder="e.g., NGN 1,250,000"
              value={form.phonePrice}
              onChange={(e) => onPhonePriceChange(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          {selectedModel && !previewUnavailable ? (
            <img
              src={selectedModel.imageUrl}
              alt={form.iphoneModel}
              className="h-28 w-full object-contain p-3"
              onError={onPreviewUnavailable}
            />
          ) : (
            <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">
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
            className={`${inputBase} ${form.plan ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"}`}
            value={form.plan}
            onChange={(e) =>
              onFormChange({
                plan: e.target.value ? getSafePlan(e.target.value) : "",
                monthlyPlan: "",
                weeklyPlan: "",
              })
            }
            disabled={!selectedModel}
          >
            <option value="">Select plan type</option>
            {selectedModel?.allowedPlans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="plan-duration" className="text-sm font-medium">
            {durationLabel}
          </label>
          <select
            id="plan-duration"
            className={`${inputBase} ${durationHasValue ? "border-input focus:ring-ring" : "border-red-500 focus:ring-red-500"}`}
            value={selectedDuration}
            onChange={(e) => {
              const value = e.target.value;
              if (isMonthly) {
                onFormChange({ monthlyPlan: value });
                return;
              }
              if (isWeekly) {
                onFormChange({ weeklyPlan: value });
              }
            }}
            disabled={!form.plan}
          >
            <option value="">{durationPlaceholder}</option>
            {isMonthly
              ? monthlyDurations.map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? "Month" : "Months"}
                  </option>
                ))
              : null}
            {isWeekly
              ? weeklyDurations.map((weeks) => (
                  <option key={weeks} value={weeks}>
                    {weeks} Weeks
                  </option>
                ))
              : null}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="down-payment" className="text-sm font-medium">
            Down Payment
          </label>
          <input
            id="down-payment"
            className={`${inputBase} ${
              downPaymentTooLow || downPaymentAbovePhonePrice
                ? "border-amber-500 bg-amber-50 text-amber-700"
                : "border-input focus:ring-ring"
            }`}
            type="text"
            inputMode="decimal"
            placeholder="e.g., NGN 500,000"
            value={form.downPayment}
            onChange={(e) => onDownPaymentChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {hasPlanAndDuration
              ? `Minimum required: ${formatAmount(minimumRequiredDownPayment)} (${downPaymentPercentage}% of phone price)`
              : "Select plan type and duration to auto-fill minimum down payment."}
          </p>
          {downPaymentTooLow ? (
            <p className="text-sm text-amber-600">Down payment is below the required minimum for this model.</p>
          ) : null}
          {downPaymentAbovePhonePrice ? (
            <p className="text-sm text-red-600">Down payment cannot be greater than phone price.</p>
          ) : null}
        </div>


        <div className="space-y-2">
          <label htmlFor="next-payment" className="text-sm font-medium">
            Next Payment
          </label>
          <input
            id="next-payment"
            className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base"
            type="text"
            value={formatAmount(Number(calculatedNextPayment.toFixed(2)))}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}



