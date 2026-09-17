import assert from 'node:assert/strict';
import { canonicalPath, articleDates } from '../src/utils/seo.mjs';

for (const locale of ['pt', 'en']) {
  for (const suffix of ['', 'index/', 'blog/', 'artigos-tecnicos/']) {
    assert.equal(canonicalPath(`/${locale}/${suffix}`), `/${locale}/artigos-tecnicos/`);
  }
  assert.equal(canonicalPath(`/${locale}/artigos-tecnicos/cpp-versoes-features/`), `/${locale}/artigos-tecnicos/cpp-versoes-features/`);
  assert.equal(canonicalPath(`/${locale}/reference`), `/${locale}/reference/`);
}
assert.equal(canonicalPath('/'), '/');
assert.deepEqual(articleDates(undefined, undefined), {});
assert.deepEqual(articleDates(new Date('invalid'), new Date('invalid')), {});
const published = new Date('2026-01-01');
const updated = new Date('2026-02-01');
assert.deepEqual(articleDates(published, updated), { datePublished: published.toISOString(), dateModified: updated.toISOString() });
assert.deepEqual(articleDates(updated, published), { datePublished: updated.toISOString() });
console.log('SEO canonical and date checks passed.');
