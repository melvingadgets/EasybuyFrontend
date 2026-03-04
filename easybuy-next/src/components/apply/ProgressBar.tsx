import type { ApplyStep } from "@/components/apply/types";

type ProgressBarProps = {
  step: ApplyStep;
};

const labels = ["Basic info", "Plan", "Review"];

export function ProgressBar({ step }: ProgressBarProps) {
  const progress = ((step - 1) / (labels.length - 1)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>Step {step} of {labels.length}</span>
        <span>{Math.round(progress)}% complete</span>
      </div>

      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground sm:text-xs">
        {labels.map((label, index) => {
          const current = index + 1;
          const active = current === step;
          const done = current < step;

          return (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : done
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background"
                }`}
              >
                {current}
              </div>
              <span className={active ? "text-foreground" : undefined}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
