# Dionisio Developer

Portfolio, blog, technical reference, and products by [@dionisiodev](https://dionisio.dev).

## Stack

- **Framework:** [Astro](https://astro.build) + [Starlight](https://starlight.astro.build)
- **Content:** Markdown/MDX, bilingual (pt-BR / en)
- **Hosting:** GitHub Pages
- **Monetization:** Google AdSense

## Project Structure

```
├── src/
│   ├── content/docs/    ← Bilingual content (pt/ and en/)
│   │   ├── artigos-tecnicos/   ← Blog posts
│   │   ├── reference/          ← Guides & tutorials
│   │   ├── projects/           ← Portfolio entries
│   │   ├── ebooks/             ← eBook landing pages
│   │   └── ...
│   ├── components/       ← Astro components
│   ├── styles/           ← Global CSS
│   └── utils/            ← Shared utilities (blog feed, etc.)
├── public/assets/        ← Static images
└── astro.config.mjs      ← Main configuration
```

## Development

```bash
npm ci
npm run dev       # Start dev server
npm run verify    # Type check, production build and internal links
npm run preview   # Preview production build, including Pagefind search
```

## Adding Blog Posts

1. Create `src/content/docs/{locale}/artigos-tecnicos/your-post.md`
2. Add frontmatter: `title`, `description`, `publishedAt`, `author`, `tags`, `cover`, `coverAlt`
3. Add to sidebar in `astro.config.mjs` under both `locales.en.sidebar` and `sidebar`

Use `updatedAt` only for a real editorial update. Keep the same slug in both languages when possible so the language switch stays on the article.

## Deployment and growth

Pushes to `master` build and deploy to [dionisio.dev](https://dionisio.dev) through `.github/workflows/deploy.yml` and GitHub Pages. Confirm the workflow succeeded before checking the public URL.

- [Analytics events and account configuration](docs/analytics.md)
- [Bilingual learning path and distribution plan](docs/content-growth.md)
- [Performance baseline](docs/performance.md)

The preferred article indexes are `/pt/artigos-tecnicos/` and `/en/artigos-tecnicos/`; older listing URLs remain available with canonical links. RSS is `/pt/rss.xml` in Portuguese and `/rss.xml` in English. Submit `/sitemap-index.xml` in Google Search Console. Account setup requires access to the site's Google properties.

## License

MIT — see [LICENSE.md](./LICENSE.md).
