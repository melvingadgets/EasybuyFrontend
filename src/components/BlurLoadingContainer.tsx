import { useEffect, useRef, useState, type ReactNode } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import loaderImage from "../IMG_1938 (1).png";

type BlurLoadingContainerProps = {
  loading: boolean;
  children: ReactNode;
  minDurationMs?: number;
};

export const BlurLoadingContainer = ({
  loading,
  children,
  minDurationMs = 1300,
}: BlurLoadingContainerProps) => {
  const [visible, setVisible] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      startedAtRef.current = Date.now();
      setVisible(true);
      return;
    }

    if (!visible) return;

    const elapsed = startedAtRef.current ? Date.now() - startedAtRef.current : 0;
    const remaining = Math.max(minDurationMs - elapsed, 0);

    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
      startedAtRef.current = null;
    }, remaining);

    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [loading, minDurationMs, visible]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className={`transition-all duration-300 ${visible ? "scale-[0.998] blur-[2px]" : "blur-0"}`}>
        {children}
      </div>

      <div
        className={`pointer-events-none fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="rounded-full border border-border bg-background/85 p-3 shadow-soft backdrop-blur-md">
          <div className="relative h-10 w-10 loader-grow-size">
            <BounceLoader
              color="hsl(var(--primary))"
              size={40}
              speedMultiplier={0.75}
              aria-label="Loading Spinner"
            />
            <img
              src={loaderImage}
              alt="Loader"
              className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
