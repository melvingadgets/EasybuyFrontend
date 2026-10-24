import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMelvinBridgeToken,
  isEmbeddedInMelvin,
  onMelvinAuthChange,
  postToMelvin,
  startMelvinAuthBridge,
} from "../lib/melvinBridge";

export const MelvinBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmbeddedInMelvin) return;

    document.documentElement.classList.add("melvin-embed");

    // Listen for the OS's token before announcing we're here, so a session that
    // arrives with the handshake isn't missed.
    startMelvinAuthBridge();
    postToMelvin("melvin:hello");

    // Two frames after the first commit the page has painted, so the OS can drop its splash.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => postToMelvin("melvin:ready"));
    });

    // Routing gates read auth synchronously, so re-point the app when the bridge
    // session changes: into the app on sign-in, back to login on sign-out.
    const unsubscribe = onMelvinAuthChange(() => {
      if (getMelvinBridgeToken()) {
        const path = window.location.pathname;
        if (path === "/" || path === "/login") {
          navigate("/dashboard", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      unsubscribe();
    };
  }, [navigate]);

  return null;
};
