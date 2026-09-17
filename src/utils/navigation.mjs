/** Resolve a translation only if the corresponding content exists. */
export function alternatePage(pathname, ids) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const isPt = path === '/pt' || path.startsWith('/pt/');
  const locale = isPt ? 'pt' : 'en';
  const other = isPt ? 'en' : 'pt';
  const suffix = path.replace(/^\/(?:pt|en)(?:\/|$)/, '');
  const aliases = {
    'ebooks/guia-do-dev-iniciante': 'ebooks/beginner-dev-guide',
    'ebooks/beginner-dev-guide': 'ebooks/guia-do-dev-iniciante',
    'ebooks/guia-avancado-cpp': 'ebooks/advanced-cpp-guide',
    'ebooks/advanced-cpp-guide': 'ebooks/guia-avancado-cpp',
  };
  const routes = new Set(ids.map((id) => id.replace(/\\/g, '/').replace(/\.(md|mdx)$/, '').replace(/\/index$/, '')));
  const candidate = `${other}/${aliases[suffix] ?? suffix}`;
  if (['/', '/en', '/pt'].includes(path)) return { locale, other, href: `/${other}/`, translated: true };
  if (routes.has(candidate)) return { locale, other, href: `/${candidate}/`, translated: true };
  return { locale, other, href: `/${other}/artigos-tecnicos/`, translated: false };
}
