import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

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
    <div className={`mt-4 flex w-full items-center justify-center gap-3 text-sm text-muted-foreground ${className}`}>
      <ClipLoader color="hsl(var(--primary))" size={16} speedMultiplier={0.85} aria-label="Loading Spinner" />
      <span>{label}</span>
    </div>
  );
};
