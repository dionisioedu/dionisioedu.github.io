import test from 'node:test';
import assert from 'node:assert/strict';
import { eventPayload, safePath } from '../src/components/analytics-contract.mjs';

test('keeps only paths and drops external targets from page identity', () => {
  assert.equal(safePath('/pt/blog/?email=private@example.org#token'), '/pt/blog/');
  assert.equal(safePath('https://other.example/path?secret=1'), '');
  assert.equal(safePath('javascript:alert(1)'), '');
});
test('event payload never includes arbitrary fields or input/query strings', () => {
  const payload = eventPayload('select_content', {
    source: 'related-posts', content_id: '/pt/article/', email: 'private@example.org',
    search_term: 'private text', method: 'email?token=secret', destination_host: 'shop.example',
  }, '/pt/blog/?secret=1');
  assert.deepEqual(payload, { content_language: 'pt', content_path: '/pt/blog/', content_id: '/pt/article/', source: 'related-posts', destination_host: 'shop.example' });
});
test('rejects invented conversions and purchase events', () => {
  assert.equal(eventPayload('purchase', {}, '/'), null);
  assert.equal(eventPayload('newsletter_confirmed', {}, '/'), null);
  assert.equal(eventPayload('lab_completed', {}, '/'), null);
  assert.equal(eventPayload('newsletter_signup', {}, '/').content_language, 'en');
});
