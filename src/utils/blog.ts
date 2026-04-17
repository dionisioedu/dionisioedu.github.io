import type { CollectionEntry } from 'astro:content';

export type BlogLocale = 'pt' | 'en';

export interface BlogTag {
  label: string;
  slug: string;
}

export interface BlogPostSummary {
  title: string;
  description?: string;
  publishedAt?: Date;
  author: string;
  cover?: string;
  coverAlt: string;
  href: string;
  excerpt: string;
  tags: BlogTag[];
}

export interface BlogTagSummary extends BlogTag {
  count: number;
}

const normalizePath = (value: string | undefined) => (value ?? '').replace(/\\/g, '/');

const isPostEntry = (value: string, locale: BlogLocale) => {
  const normalized = normalizePath(value);
  return normalized.startsWith(`${locale}/artigos-tecnicos/`) && !normalized.endsWith('/index');
};

export const isBlogListingEntry = (entryId: string | undefined, locale: BlogLocale) => {
  const normalized = normalizePath(entryId);
  return (
    normalized === `${locale}/index.mdx` ||
    normalized === `${locale}/index.md` ||
    normalized === `${locale}/blog.mdx` ||
    normalized === `${locale}/blog.md`
  );
};

export const isBlogListingPath = (pathname: string | undefined) =>
  /^\/(?:(pt|en)\/)?(?:(?:blog|artigos-tecnicos)\/)?$/.test(pathname ?? '/');

export const toHref = (value: string) => {
  const normalized = normalizePath(value)
    .replace(/\.(md|mdx)$/i, '')
    .replace(/\/index$/i, '');
  return `/${normalized.replace(/^\/+/, '')}/`;
};

const cleanInlineMarkdown = (value: string) =>
  value
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const extractExcerpt = (body: string | undefined, fallback: string | undefined) => {
  const cleanedBody = (body ?? '')
    .replace(/\r/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<section[\s\S]*?<\/section>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');

  const paragraph = cleanedBody
    .split(/\n\s*\n/)
    .map((chunk) => cleanInlineMarkdown(chunk))
    .find(
      (chunk) =>
        chunk &&
        !chunk.startsWith('#') &&
        !chunk.startsWith('>') &&
        !chunk.startsWith('- ') &&
        !chunk.startsWith('* ') &&
        !/^\d+\.\s/.test(chunk) &&
        !chunk.startsWith('|')
    );

  const excerpt = paragraph || cleanInlineMarkdown(fallback ?? '');

  if (excerpt.length <= 240) return excerpt;
  const trimmed = excerpt.slice(0, 237);
  return `${trimmed.slice(0, trimmed.lastIndexOf(' '))}...`;
};

export const formatBlogDate = (date: Date | undefined, locale: BlogLocale) =>
  date?.toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export const slugifyTag = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const normalizeTags = (tags: string[] | undefined) =>
  (tags ?? [])
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => ({
      label: tag,
      slug: slugifyTag(tag),
    }));

export const getLocalizedBlogPosts = (docs: CollectionEntry<'docs'>[], locale: BlogLocale) =>
  docs
    .filter((entry) => isPostEntry(entry.id, locale))
    .map(
      (entry): BlogPostSummary => ({
        title: entry.data.title,
        description: entry.data.description,
        publishedAt: entry.data.publishedAt,
        author: entry.data.author ?? 'Dionisio',
        cover: entry.data.cover,
        coverAlt: entry.data.coverAlt ?? entry.data.title,
        href: toHref(entry.id),
        excerpt: extractExcerpt(entry.body, entry.data.description),
        tags: normalizeTags(entry.data.tags),
      })
    )
    .sort((a, b) => {
      const aTime = a.publishedAt?.getTime() ?? 0;
      const bTime = b.publishedAt?.getTime() ?? 0;
      return bTime - aTime;
    });

export const getBlogTagSummary = (posts: BlogPostSummary[]) => {
  const tagMap = new Map<string, BlogTagSummary>();

  for (const post of posts) {
    for (const tag of post.tags) {
      const current = tagMap.get(tag.slug);
      if (current) {
        current.count += 1;
      } else {
        tagMap.set(tag.slug, { ...tag, count: 1 });
      }
    }
  }

  return [...tagMap.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.label.localeCompare(b.label);
  });
};
