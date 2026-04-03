import type { ApplyFormState } from "@/components/apply/types";

type StepOneBasicInfoProps = {
  form: ApplyFormState;
  errors: Partial<Record<"fullName" | "email" | "phone", string>>;
  onChange: (field: keyof ApplyFormState, value: string) => void;
  onFirstInteraction: () => void;
};

const inputBase = "w-full rounded-md border bg-background px-3 py-2.5 text-base focus:outline-none focus:ring-2";

export function StepOneBasicInfo({ form, errors, onChange, onFirstInteraction }: StepOneBasicInfoProps) {
  return (
    <div className="space-y-5 step-enter">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="full-name" className="text-sm font-medium">
            Full Name
          </label>
          <input
            id="full-name"
            className={`${inputBase} ${errors.fullName ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`}
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            onFocus={onFirstInteraction}
            autoComplete="name"
          />
          {errors.fullName ? <p className="text-sm text-red-600">{errors.fullName}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`${inputBase} ${errors.email ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`}
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            autoComplete="email"
          />
          {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            className={`${inputBase} ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-ring"}`}
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="e.g. +234..."
            autoComplete="tel"
          />
          {errors.phone ? <p className="text-sm text-red-600">{errors.phone}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-heading text-xl font-semibold">Secure application</p>
        <p className="mt-1 text-sm text-emerald-800">
          Your personal details are encrypted in transit and used only to process your EasyBuy request.
        </p>
      </div>
    </div>
  );
}
