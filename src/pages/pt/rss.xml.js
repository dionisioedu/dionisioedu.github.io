import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getLocalizedBlogPosts } from '../../utils/blog';

export async function GET() {
  const posts = getLocalizedBlogPosts(await getCollection('docs'), 'pt');
  return rss({
    title: 'Dionisio Developer — Português',
    description: 'Artigos sobre C++, sistemas de baixa latência, engenharia de performance e desenvolvimento de software por Eduardo Dionisio.',
    site: 'https://dionisio.dev',
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: '<language>pt-BR</language><atom:link href="https://dionisio.dev/pt/rss.xml" rel="self" type="application/rss+xml"/>',
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      link: `https://dionisio.dev${post.href}`,
      ...(post.publishedAt ? { pubDate: post.publishedAt } : {}),
      categories: post.tags.map((tag) => tag.label),
    })),
  });
}
