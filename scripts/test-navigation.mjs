import assert from 'node:assert/strict';
import { alternatePage } from '../src/utils/navigation.mjs';

const ids = ['en/artigos-tecnicos/cpp.md', 'pt/artigos-tecnicos/cpp.md', 'pt/reference/index.md', 'en/ebooks/advanced-cpp-guide.md'];
assert.equal(alternatePage('/pt/artigos-tecnicos/cpp/', ids).href, '/en/artigos-tecnicos/cpp/');
assert.equal(alternatePage('/en/artigos-tecnicos/cpp/', ids).href, '/pt/artigos-tecnicos/cpp/');
assert.equal(alternatePage('/en/reference/', ids).href, '/pt/reference/');
assert.equal(alternatePage('/pt/ebooks/guia-avancado-cpp/', ids).href, '/en/ebooks/advanced-cpp-guide/');
assert.deepEqual(alternatePage('/en/missing/', ids), { locale: 'en', other: 'pt', href: '/pt/artigos-tecnicos/', translated: false });
assert.equal(alternatePage('/', ids).href, '/pt/');
console.log('Navigation translations and fallback passed.');
