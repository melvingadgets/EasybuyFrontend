const MARKER_ATTR = "data-overflow-debug";

const getElementLabel = (element: Element) => {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const className =
    typeof element.className === "string" && element.className.trim()
      ? `.${element.className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : "";
  return `${tag}${id}${className}`;
};

const clearMarkers = () => {
  const marked = document.querySelectorAll<HTMLElement>(`[${MARKER_ATTR}="true"]`);
  marked.forEach((element) => {
    element.removeAttribute(MARKER_ATTR);
    element.style.outline = "";
    element.style.outlineOffset = "";
  });
};

export const startDevOverflowGuard = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => undefined;
  }

  let rafId: number | null = null;
  let lastSignature = "";

  const scan = () => {
    rafId = null;

    const viewportWidth = window.innerWidth;
    const documentOverflow = Math.max(0, document.documentElement.scrollWidth - viewportWidth);

    clearMarkers();

    if (documentOverflow <= 1) {
      lastSignature = "";
      return;
    }

    const candidates = Array.from(document.body.querySelectorAll<HTMLElement>("*"));
    const offenders = candidates
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const overflow = Math.max(rect.right - viewportWidth, 0, -rect.left);
        return { element, overflow };
      })
      .filter(({ element, overflow }) => {
        if (overflow <= 1) return false;
        if (!element.offsetParent && getComputedStyle(element).position !== "fixed") return false;
        return true;
      })
      .sort((a, b) => b.overflow - a.overflow)
      .slice(0, 8);

    const signature = `${documentOverflow.toFixed(1)}|${offenders
      .map((item) => `${getElementLabel(item.element)}:${item.overflow.toFixed(1)}`)
      .join("|")}`;
    if (signature === lastSignature) return;
    lastSignature = signature;

    offenders.slice(0, 3).forEach(({ element }) => {
      element.setAttribute(MARKER_ATTR, "true");
      element.style.outline = "2px solid rgba(239, 68, 68, 0.9)";
      element.style.outlineOffset = "-1px";
    });

    console.groupCollapsed(
      `[overflow-guard] horizontal overflow +${documentOverflow.toFixed(1)}px (top offenders: ${offenders.length})`
    );
    offenders.forEach(({ element, overflow }, index) => {
      console.log(`#${index + 1}`, getElementLabel(element), `+${overflow.toFixed(1)}px`, element);
    });
    console.groupEnd();
  };

  const scheduleScan = () => {
    if (rafId !== null) return;
    rafId = window.requestAnimationFrame(scan);
  };

  const observer = new MutationObserver(scheduleScan);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style"],
  });

  window.addEventListener("resize", scheduleScan);
  window.addEventListener("orientationchange", scheduleScan);
  window.addEventListener("load", scheduleScan);

  scheduleScan();

  return () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    observer.disconnect();
    window.removeEventListener("resize", scheduleScan);
    window.removeEventListener("orientationchange", scheduleScan);
    window.removeEventListener("load", scheduleScan);
    clearMarkers();
  };
};
