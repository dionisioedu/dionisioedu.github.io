/** Localized homepages now have editorial content distinct from the archive. */
export function canonicalPath(pathname) {
  const path = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  if (/^\/en\/(?:index\/)?$/.test(path)) return '/';
  if (/^\/pt\/(?:index\/)?$/.test(path)) return '/pt/';
  const listing = path.match(/^\/(pt|en)\/(?:blog\/|artigos-tecnicos\/)$/);
  return listing ? `/${listing[1]}/artigos-tecnicos/` : path;
}

export function articleDates(publishedAt, updatedAt) {
  const valid = (date) => date instanceof Date && Number.isFinite(date.getTime());
  return {
    ...(valid(publishedAt) ? { datePublished: publishedAt.toISOString() } : {}),
    ...(valid(updatedAt) && (!valid(publishedAt) || updatedAt >= publishedAt)
      ? { dateModified: updatedAt.toISOString() } : {}),
  };
}
