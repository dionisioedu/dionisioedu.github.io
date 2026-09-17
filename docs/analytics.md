# Analytics and engagement

GA4 property tag: `G-7BZ62SG9QF`. Runs only in production builds on `dionisio.dev` or `www.dionisio.dev`; previews and development do not send events. `GoogleAnalytics.astro` owns the single config call; `analytics.client.js` uses one delegated listener and exports `track(name, details)`.

## Event contract

All custom events carry `content_language` and `content_path`. Allowlisted optional fields: `content_id`, `source`, `method`, `lab_id`, `action`, `destination_host`. Never send email, form values, lab input/code, search terms, link text, query strings, fragments, user IDs, or entire external URLs. Page URL excludes query/hash; referrer is origin only. Google signals and ad personalization disabled. Acquisition source/medium remains GA4's standard reporting dimension; custom `source` denotes UI placement, not a user-supplied UTM value.

| Event | Trigger | Meaning |
| --- | --- | --- |
| `newsletter_submit` | Valid form submit before network request | Attempt, not a conversion |
| `newsletter_signup` | Kit HTTP success AND JSON `status: "success"` | Subscription request accepted; **not** email/double opt-in confirmation |
| `select_content` | Related article/trail link click | Next content selected |
| `search_result_click` | `data-search-result` link click | Result selected; query never sent |
| `lab_use` | Run/start button or binary inspector committed change | Interaction, never execution success/completion |
| `outbound_click` | External HTTPS link from shop/books | Product-page outbound click, never purchase |
| `contact_click` | mailto or wa.me click | Contact intent, not delivered message |
| `share` | Native share resolves or clipboard write resolves | Successful share API/copy operation, not downstream delivery |
| `file_download` | Download link click | Download initiated, not transfer completion |

Explicit hooks: `data-analytics-event`, optional `data-content-id`, `data-analytics-source`. Event names are allowlisted. Plain download links, related cards, search results and existing laboratory selectors work automatically. No input values enter telemetry.

## Newsletter

`Newsletter.astro` is bilingual and reserves layout space. It uses the existing Kit form **9715720**, UID **6fa15fabec**, without the old decorative 222 KiB image or third-party embed bundle. No Kit resource loads until a visitor submits; this removes the need to lazy-load an embed. The native form POST and visible hosted Kit link remain usable if JS is unavailable. JS handles retry/error and disables duplicate submissions while pending. No test subscriptions were sent.

Public configuration inspected: https://dionisio-developer.kit.com/6fa15fabec/index.js and https://f.convertkit.com/ckjs/ck.5.js. The current form has reCAPTCHA disabled; the official client distinguishes `status: success`, `quarantined`, and errors. Only `success` counts here; quarantined responses route users to the hosted form through the fallback. If the account enables anti-bot challenges later, revalidate the custom form or use the hosted form. A local accepted request cannot establish inbox confirmation. Confirmed subscribers require a Kit-side integration/webhook, which is not configured by this change.

## Required account work

No access to GA4 administration, Search Console or Kit account settings was available. None of the following is claimed complete:

1. In GA4 DebugView/Realtime, verify one event per intended interaction on the live site. Register custom dimensions `content_language`, `content_id`, `source`, `lab_id` as needed. Mark `newsletter_signup` as a key event only if **accepted request** is the agreed business metric; use a separate server-confirmed event for double opt-in.
2. Audit Enhanced Measurement: turn **off form interactions and site search** to prevent automatic form/search capture. Turn off file downloads if custom `file_download` is used, avoiding duplicate counts for recognized extensions. Disable outgoing-link clicks if reporting exclusively the custom events. Review privacy settings/consent for the intended deployment with the site owner.
3. Verify the `dionisio.dev` Domain property in Search Console via DNS; submit `https://dionisio.dev/sitemap-index.xml`. Inspect PT/EN representative pages and review indexing/canonical selection. Never add a fabricated verification token to the site.
4. Establish a baseline split by locale/article/device: search impressions, clicks, CTR; organic users; next-content clicks; accepted newsletter requests; contact/product interest. Compare after enough traffic accumulates, rather than interpreting a single day's movement.
5. Keep campaign UTMs restricted to controlled campaign names, never personal data. No automatic publishing to social accounts is implemented. Attribution explicitly forwards only campaign `cpp_learning_path`, source `linkedin|x|youtube|newsletter`, and medium `social|video|email` when all three match. Other query values are dropped. Check campaign attribution in the account; update this code allowlist when adding an approved campaign.

Tests: `node --test scripts/test-analytics.mjs`. These validate event filtering and sanitization. They do not prove GA receipt or a real email subscription; verify those in account interfaces after deployment.
