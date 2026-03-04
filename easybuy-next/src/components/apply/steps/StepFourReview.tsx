import type { ApplyFormState } from "@/components/apply/types";
import { formatAmount } from "@/components/apply/helpers";

type StepFourReviewProps = {
  form: ApplyFormState;
  downPaymentPercentage: number;
  minimumRequiredDownPayment: number;
  calculatedNextPayment: number;
};

export function StepFourReview({
  form,
  downPaymentPercentage,
  minimumRequiredDownPayment,
  calculatedNextPayment,
}: StepFourReviewProps) {
  const durationText =
    form.plan === "Monthly"
      ? form.monthlyPlan
        ? `${form.monthlyPlan} month(s)`
        : "Not selected"
      : form.weeklyPlan
        ? `${form.weeklyPlan} week(s)`
        : "Not selected";

  return (
    <div className="space-y-5 step-enter">
      <div className="rounded-xl border border-border bg-muted p-4">
        <h2 className="font-heading text-xl font-semibold">Review your request</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm these details before you submit. You can still go back and edit.
        </p>

        <dl className="mt-4 grid gap-3 text-base sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="font-medium">{form.fullName || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="font-medium">{form.email || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Phone</dt>
            <dd className="font-medium">{form.phone || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Device</dt>
            <dd className="font-medium">{form.iphoneModel ? `${form.iphoneModel} (${form.capacity})` : "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Plan Type</dt>
            <dd className="font-medium">{form.plan || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Plan Duration</dt>
            <dd className="font-medium">{durationText}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Phone Price</dt>
            <dd className="font-medium">{form.phonePrice || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Down Payment</dt>
            <dd className="font-medium">{form.downPayment || "-"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Minimum Required</dt>
            <dd className="font-medium">
              {formatAmount(minimumRequiredDownPayment)} ({downPaymentPercentage}%)
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Estimated Next Payment</dt>
            <dd className="font-medium">{formatAmount(Number(calculatedNextPayment.toFixed(2)))}</dd>
          </div>

        </dl>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-heading text-xl font-semibold">Data protection</p>
        <p className="mt-1 text-sm text-emerald-800">
          By submitting, you confirm these details are accurate. Approval and next steps are handled by admin.
        </p>
      </div>
    </div>
  );
}



