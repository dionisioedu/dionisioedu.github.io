import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getLocalizedBlogPosts } from '../utils/blog';

export async function GET() {
  const docs = await getCollection('docs');
  const posts = getLocalizedBlogPosts(docs, 'en');

  return rss({
    title: 'Dionisio Developer',
    description: 'Writing on C++, low-latency systems, performance engineering, and software craftsmanship by Eduardo Dionisio.',
    site: 'https://dionisio.dev',
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="https://dionisio.dev/rss.xml" rel="self" type="application/rss+xml"/>`,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      link: `https://dionisio.dev${post.href}`,
      pubDate: post.publishedAt ?? new Date(),
      author: post.author,
      categories: post.tags.map((t) => t.label),
    })),
  });
}
