/* Fire-and-forget analytics tracking — never blocks UI */
export function track(event) {
  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
      keepalive: true, // works even if page unloads
    }).catch(() => {});
  } catch {}
}

export const trackPageView   = () => track('pageview');
export const trackPhoneClick = () => track('phone_click');
export const trackSearch     = () => track('search');
export const trackWorkerView = () => track('worker_view');
