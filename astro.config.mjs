import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/',
  output: 'static',
  integrations: [
    starlight({
      title: 'Dev Hub',
      description: 'A reference hub for developers: wiki, tools, and tech radar.',

      // i18n — automatically infer from src/content/docs structure
      locales: {
        pt: { label: 'Português', lang: 'pt-BR' },
        en: { label: 'English', lang: 'en' },
      },
      defaultLocale: 'pt',
      
      sidebar: [
        {
          label: 'eBooks',
          slug: 'guides/books',
        },
        {
          label: 'Shop',
          slug: 'guides/shop',
        },
        {
          label: 'Reference',
          items: [
            { label: 'Architecture notes', slug: 'reference/architecture' },
            { label: 'Engineering standards', slug: 'reference/standards' },
            { label: 'Data Structures & Algorithms', slug: 'reference/dsa' },
          ],
        },
        {
          label: 'Tutorials',
          items: [
            { label: 'Hello World in C++', slug: 'tutorials/hello-world-cpp' },
          ],
        },
        {
          label: 'Projects',
          slug: 'projects',
        },
      ],
    }),
  ],
});