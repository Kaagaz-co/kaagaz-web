// Lightweight Google Analytics helpers for manual event + pageview tracking.
// Only loads if the global gtag snippet is present (inserted in index.html)

export function trackPageView(path) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title
    });
  }
}

export function trackEvent({ action, category, label, value }) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value
    });
  }
}

// Convenience hook for React Router style navigation (if you add a router later)
// Usage example after integrating a router: useEffect(() => trackPageView(location.pathname), [location.pathname]);
