# Performance and release baseline

Measured 2026-09-16, before this release, for the Portuguese C++ versions article.
[Mobile PageSpeed report](https://pagespeed.web.dev/analysis/https-dionisio-dev-pt-artigos-tecnicos-cpp-versoes-features/ad290fzrbp?form_factor=mobile).

| Metric | Before |
| --- | ---: |
| Performance | 54 |
| Accessibility | 85 |
| Best practices | 100 |
| SEO | 92 |
| FCP | 5.4 s |
| LCP | 7.5 s |
| Total blocking time | 330 ms |
| CLS | 0 |

Lighthouse 13.4.1, emulated Moto G Power, slow 4G. No Chrome UX Report field data was available. A single lab run is diagnostic evidence, not a traffic or ranking forecast.

Changes: explicit hero dimensions and high fetch priority, WebP cover (47,083 to 17,172 bytes), deferred AdSense initialization after load, a lightweight newsletter form with no embed or decorative image, accessible search and navigation, visible article titles and underlined prose links.

Repeat the same mobile URL after deployment. Track field Core Web Vitals in Search Console when sufficient real traffic exists. Compare engagement by locale and content over at least 28 days; see analytics.md and content-growth.md.
