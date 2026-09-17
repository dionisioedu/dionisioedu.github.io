export const events = new Set(['newsletter_submit', 'newsletter_signup', 'select_content', 'outbound_click', 'contact_click', 'share', 'file_download', 'lab_use', 'search_result_click']);
export function safePath(value, origin = 'https://dionisio.dev') {
  try { const url = new URL(value, origin); return url.origin === origin ? url.pathname : ''; } catch { return ''; }
}
export function eventPayload(name, details, pathname) {
  if (!events.has(name)) return null;
  const payload = { content_language: pathname.startsWith('/pt/') ? 'pt' : 'en', content_path: safePath(pathname) };
  for (const key of ['content_id', 'source', 'method', 'lab_id', 'action', 'destination_host']) {
    const value = details[key];
    if (typeof value === 'string' && /^[a-zA-Z0-9_.\/-]{1,120}$/.test(value)) payload[key] = value;
  }
  return payload;
}
