import type { ReactNode } from "react";

type MobileFieldProps = {
  label: string;
  value: ReactNode;
  className?: string;
};

export const MobileField = ({ label, value, className = "" }: MobileFieldProps) => {
  return (
    <div className={className}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
};
