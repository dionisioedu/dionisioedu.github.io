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
pnpm install
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview production build
```

## Adding Blog Posts

1. Create `src/content/docs/{locale}/artigos-tecnicos/your-post.md`
2. Add frontmatter: `title`, `description`, `publishedAt`, `author`, `tags`, `cover`, `coverAlt`
3. Add to sidebar in `astro.config.mjs` under both `locales.en.sidebar` and `sidebar`

## License

MIT — see [LICENSE.md](./LICENSE.md).
