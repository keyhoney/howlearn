/**
 * GA4 event helpers (outbound_click, scroll_depth, search, concept_click).
 * Only active when NEXT_PUBLIC_GA_ID is set.
 */

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackOutboundClick(url: string, label?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "outbound_click", {
      link_url: url,
      outbound_link: url,
      event_callback: () => {},
      ...(label && { link_text: label }),
    });
  }
}

export function trackScrollDepth(percent: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "scroll_depth", {
      percent_scrolled: percent,
      value: percent,
    });
  }
}

export function trackSearch(term: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "search", {
      search_term: term,
    });
  }
}

export function trackConceptClick(conceptSlug: string, linkUrl: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "concept_click", {
      concept_slug: conceptSlug,
      link_url: linkUrl,
    });
  }
}

export function trackGuideCtaClick(ctaLabel: string, destinationUrl: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "guide_cta_click", {
      cta_label: ctaLabel,
      destination_url: destinationUrl,
    });
  }
}
