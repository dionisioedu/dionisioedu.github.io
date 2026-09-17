import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = (route) => fs.readFileSync(`dist/${route}index.html`, 'utf8');
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const tags = (source, name) => [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => attributes(m[0]));
const canonical = (source) => tags(source, 'link').filter((tag) => tag.rel === 'canonical');

assert.deepEqual(canonical(html('')).map((t) => t.href), ['https://dionisio.dev/']);
for (const locale of ['en', 'pt']) {
  for (const alias of ['', 'blog/', 'artigos-tecnicos/']) {
    assert.deepEqual(canonical(html(`${locale}/${alias}`)).map((t) => t.href), [`https://dionisio.dev/${locale}/artigos-tecnicos/`]);
  }
  const route = `${locale}/artigos-tecnicos/cpp-versoes-features/`;
  const source = html(route);
  assert.deepEqual(canonical(source).map((t) => t.href), [`https://dionisio.dev/${route}`]);
  const alternates = tags(source, 'link').filter((t) => t.hreflang);
  assert(alternates.some((t) => t.hreflang === 'en' && t.href.endsWith('/en/artigos-tecnicos/cpp-versoes-features/')));
  assert(alternates.some((t) => t.hreflang === 'pt-BR' && t.href.endsWith('/pt/artigos-tecnicos/cpp-versoes-features/')));
  const structured = [...source.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const article = structured.find((item) => item['@type'] === 'BlogPosting');
  assert(article, `BlogPosting missing: ${route}`);
  assert(article['@id'].startsWith(`https://dionisio.dev/${route}`));
  assert(article.datePublished.startsWith('2026-09-15'));
  assert(!article.dateModified || Date.parse(article.dateModified) >= Date.parse(article.datePublished));
  const rss = fs.readFileSync(`dist/${locale === 'pt' ? 'pt/' : ''}rss.xml`, 'utf8');
  assert(rss.includes(`https://dionisio.dev/${route}`));
  assert(fs.existsSync(`dist/${locale}/reference/trilha-cpp/index.html`));
  assert(fs.existsSync(`dist/downloads/cpp-modernization-checklist-${locale}.md`));
}
assert(fs.readFileSync('dist/robots.txt', 'utf8').includes('https://dionisio.dev/sitemap-index.xml'));
console.log('Release canonical, alternates, schema, feeds and learning assets passed.');
