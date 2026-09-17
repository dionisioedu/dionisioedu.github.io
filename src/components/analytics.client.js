import { eventPayload } from './analytics-contract.mjs';
export function track(name, details = {}) {
  if (!import.meta.env.PROD || !['dionisio.dev', 'www.dionisio.dev'].includes(location.hostname) || typeof window.gtag !== 'function') return;
  const payload = eventPayload(name, details, location.pathname);
  if (payload) window.gtag('event', name, payload);
}
if (typeof document !== 'undefined' && !window.__siteAnalyticsBound) {
  window.__siteAnalyticsBound = true;
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const el = event.target.closest('a, button');
    if (!el) return;
    const lab = el.matches('[data-runner-run]') ? 'code-runner' : el.matches('[data-array-run], [data-graph-run]') ? 'algorithm-studio' : el.matches('[data-quiz-start]') ? 'career-quiz' : '';
    if (lab) { track('lab_use', { lab_id: lab, action: 'start' }); return; }
    if (!(el instanceof HTMLAnchorElement)) return;
    const url = new URL(el.href, location.origin);
    if (el.hasAttribute('data-search-result')) track('search_result_click', { content_id: url.pathname, source: 'site-search' });
    else if (el.dataset.analyticsEvent) track(el.dataset.analyticsEvent, { content_id: el.dataset.contentId || url.pathname, source: el.dataset.analyticsSource || 'content' });
    else if (el.hasAttribute('download')) track('file_download', { content_id: url.pathname, source: 'content' });
    else if (url.protocol === 'mailto:' || url.hostname === 'wa.me') track('contact_click', { method: url.protocol === 'mailto:' ? 'email' : 'whatsapp' });
    else if (/\/(shop|books|ebooks)\//.test(location.pathname) && url.origin !== location.origin && url.protocol === 'https:') track('outbound_click', { destination_host: url.hostname, source: 'product' });
  });
  document.addEventListener('change', (event) => {
    if (event.target instanceof Element && event.target.matches('[data-binary-inspector] input')) track('lab_use', { lab_id: 'binary-inspector', action: 'change' });
  });
}
