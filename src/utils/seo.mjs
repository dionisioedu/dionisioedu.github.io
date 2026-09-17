/** Keep legacy blog indexes reachable while consolidating their search signals. */
export function canonicalPath(pathname) {
  const path = `/${pathname.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
  const listing = path.match(/^\/(pt|en)\/(?:index\/|blog\/|artigos-tecnicos\/)?$/);
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
