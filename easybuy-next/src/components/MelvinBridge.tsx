"use client";

import { useEffect } from "react";
import { isEmbeddedInMelvin, postToMelvin } from "@/lib/melvinBridge";

export function MelvinBridge() {
  useEffect(() => {
    if (!isEmbeddedInMelvin()) return;

    document.documentElement.classList.add("melvin-embed");
    postToMelvin("melvin:hello");

    // Two frames after hydration the page has painted, so the OS can drop its splash.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => postToMelvin("melvin:ready"));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  return null;
}
