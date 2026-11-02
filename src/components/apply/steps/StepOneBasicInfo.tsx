import type { ApplyFormState } from "../types";

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
      {/* Application Method Split: Online vs Physical Appearance */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">
          Application Method
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              onFirstInteraction();
              onChange("applicationType", "online");
            }}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              form.applicationType !== "physical_appearance"
                ? "border-emerald-600 bg-emerald-500/10 shadow-sm ring-2 ring-emerald-600"
                : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🌐</span>
              <span className="font-semibold text-foreground">100% Online Application</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Submit your request and upload documents online. Reviewed remotely; get your device delivered or dispatched.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              onFirstInteraction();
              onChange("applicationType", "physical_appearance");
              if (!form.visitStoreLocation) {
                onChange("visitStoreLocation", "No. 7 Otigba Street, Beside Micro Station, Computer Village, Ikeja, Lagos");
              }
              if (!form.visitTimeSlot) {
                onChange("visitTimeSlot", "10:00 AM - 12:00 PM");
              }
            }}
            className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
              form.applicationType === "physical_appearance"
                ? "border-emerald-600 bg-emerald-500/10 shadow-sm ring-2 ring-emerald-600"
                : "border-border bg-card hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <span className="font-semibold text-foreground">Physical Appearance (In-Store)</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload documents online first, get a Verification Pass, and visit our Computer Village store for biometric check & device pickup.
            </p>
          </button>
        </div>
      </div>

      {/* In-Store Appointment Details if Physical Appearance is chosen */}
      {form.applicationType === "physical_appearance" ? (
        <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">📍</span>
            <div>
              <p className="text-sm font-semibold text-foreground">Melvin Gadgets Hub — Ikeja Store</p>
              <p className="text-xs text-muted-foreground">
                No. 7 Otigba Street, Beside Micro Station, Computer Village, Ikeja, Lagos.
                <span className="block font-medium text-emerald-700 dark:text-emerald-400">
                  Open: Mon – Sat (9:00 AM – 6:00 PM)
                </span>
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="visit-date" className="text-xs font-semibold text-foreground">
                Scheduled Visit Date
              </label>
              <input
                id="visit-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.visitDate}
                onChange={(e) => onChange("visitDate", e.target.value)}
                className={inputBase}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="visit-time-slot" className="text-xs font-semibold text-foreground">
                Preferred Time Slot
              </label>
              <select
                id="visit-time-slot"
                value={form.visitTimeSlot || "10:00 AM - 12:00 PM"}
                onChange={(e) => onChange("visitTimeSlot", e.target.value)}
                className={inputBase}
              >
                <option value="10:00 AM - 12:00 PM">Morning: 10:00 AM - 12:00 PM</option>
                <option value="12:00 PM - 02:00 PM">Midday: 12:00 PM - 02:00 PM</option>
                <option value="02:00 PM - 04:00 PM">Afternoon: 02:00 PM - 04:00 PM</option>
                <option value="04:00 PM - 06:00 PM">Evening: 04:00 PM - 06:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      ) : null}

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
        <p className="text-xl font-semibold">Secure application</p>
        <p className="mt-1 text-sm text-emerald-800">
          Your personal details are encrypted in transit and used only to process your EasyBuy request.
        </p>
      </div>
    </div>
  );
}
