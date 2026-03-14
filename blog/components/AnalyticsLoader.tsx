"use client";

import { useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const FALLBACK_MS = 5000;

/**
 * Loads gtag.js only after first user interaction (or after FALLBACK_MS).
 * Reduces unused JS on initial load and improves LCP/FCP.
 */
export function AnalyticsLoader() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!GA_ID || typeof window === "undefined") return;

    const loadGtag = () => {
      if (loaded.current) return;
      loaded.current = true;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.onload = () => {
        if (typeof window.gtag === "function") {
          (window.gtag as (c: string, ...args: unknown[]) => void)("js", new Date());
          (window.gtag as (c: string, ...args: unknown[]) => void)("config", GA_ID);
        }
      };
      document.head.appendChild(script);
    };

    const onInteraction = () => {
      loadGtag();
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", onInteraction, { capture: true });
      window.removeEventListener("click", onInteraction, { capture: true });
      window.removeEventListener("keydown", onInteraction, { capture: true });
    };

    window.addEventListener("scroll", onInteraction, { capture: true, once: true });
    window.addEventListener("click", onInteraction, { capture: true, once: true });
    window.addEventListener("keydown", onInteraction, { capture: true, once: true });

    const timeout = window.setTimeout(loadGtag, FALLBACK_MS);

    return () => {
      removeListeners();
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
