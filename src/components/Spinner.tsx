import { useEffect, useState } from "react";

type SpinnerProps = {
  label?: string;
  className?: string;
  delayMs?: number;
};

export const Spinner = ({ label = "Loading...", className = "", delayMs = 500 }: SpinnerProps) => {
  const [visible, setVisible] = useState(delayMs <= 0);

  useEffect(() => {
    if (delayMs <= 0) {
      setVisible(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      setVisible(false);
    };
  }, [delayMs]);

  if (!visible) return null;

  return (
    <div className={`mt-4 flex items-center gap-3 text-sm text-muted-foreground ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      <span>{label}</span>
    </div>
  );
};
