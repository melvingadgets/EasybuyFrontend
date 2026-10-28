import type { ReactNode } from "react";
import { ProgressBar } from "./ProgressBar";
import type { ApplyStep } from "./types";
// The same asset the standalone Apply app uses, shared rather than copied — the repo already
// imports it this way in GlobalLoadingOverlay.
import headerImage from "../../../easybuy-next/src/IMG_1938 (1).png";

type FormLayoutProps = {
  step: ApplyStep;
  children: ReactNode;
};

export function FormLayout({ step, children }: FormLayoutProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-soft sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_128px] sm:items-start sm:gap-5">
        <div>
          <h1 className="text-2xl font-semibold sm:text-[28px]">
            Own The iPhone You Deserve,
            <span className="block">Pay Small Small</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Complete the short steps below.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No account needed to apply. Sign in afterwards to add your documents.
          </p>
        </div>

        <div className="hidden sm:block">
          <img src={headerImage} alt="Melvin Gadgets" className="h-24 w-full rounded-lg object-cover" />
        </div>
      </div>

      <div className="mt-6">
        <ProgressBar step={step} />
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
