# Observability

Three independent layers. Interaction analytics was already in place; uptime
monitoring was added after a GitHub Pages incident silently served 404 across
the whole site while the deploy workflow reported success.

## 1. Uptime + content sanity (external, agent-side)

Script: `~/.hermes/scripts/dionisio_uptime_monitor.py`
State:  `~/.hermes/state/dionisio-uptime.json`
Cron:   job `dionisio.dev uptime monitor` (every 15 min, delivers to Telegram)

What it does:
- Probes 13 URLs across `dionisio.dev`: critical pages (home, both locales,
  blog index, two articles, downloads, shop) and assets (sitemap, llms.txt,
  both RSS feeds, a wallpaper binary).
- A check fails on non-200 OR on a missing expected marker in the body. The
  marker check catches the failure mode seen live: HTTP 200 served with the
  wrong/404 page. HTTP status alone is not enough.
- Only alerts on STATE TRANSITIONS. It compares against the persisted state
  file, so a persistent outage alerts once, not every 15 minutes. A recovery
  emits a "back up" message. First run while up is silent (baseline only).
- Critical checks failing => site DOWN. Asset-only failures => WARN, reported
  on transition, do not declare the site down.

Why external and not GitHub Actions: GitHub itself was reporting the deploy as
`success` while the CDN served 404. The monitor must be independent of the
platform it is watching.

Manual run: `python3 ~/.hermes/scripts/dionisio_uptime_monitor.py`
Force a test: rewrite `site_up` in the state file, then run the monitor.

## 2. Interaction analytics (in-repo, GA4)

Already present. GA4 property `G-7BZ62SG9QF`, production-only, hostname-gated to
`dionisio.dev` / `www.dionisio.dev`. See `docs/analytics.md` for the full event
contract. Key mechanics:
- `GoogleAnalytics.astro` owns the single gtag config call.
- `analytics.client.js` uses one delegated click listener + `track(name, details)`.
- `analytics-contract.mjs` allowlists events and strips PII (no emails, inputs,
  search terms, query strings, fragments, user IDs, full external URLs).
- Declarative hooks: `data-analytics-event`, `data-content-id`,
  `data-analytics-source`. Downloads (`<a download>`), related cards, search
  results and labs are wired automatically.
- Tests: `node --test scripts/test-analytics.mjs`.

## 3. Build-time content integrity (in-repo)

- `scripts/check-dist-links.mjs` — every internal link in `dist/` resolves.
- `scripts/check-dist-seo.mjs` — canonical, reciprocal hreflang, schema, feeds,
  and required learning assets (checklists, wallpaper) exist in `dist/`.
- `node --test scripts/test-*.mjs` — contract/analytics tests.

## Not yet implemented (candidate next layers)

- Runtime JS error capture (e.g. Sentry free tier) for uncaught errors and
  unhandled rejections — would have surfaced UI regressions like the invisible
  download button without a manual visual check.
- Core Web Vitals reported as GA4 events, baselined per locale and page type.
- External link rot crawler (weekly), and external-link HEAD checks in CI.
- Sitemap-vs-actual-pages parity check to detect orphaned/removed pages.
