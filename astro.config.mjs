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
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico',
          },
        },
      ],

      // i18n — automatically infer from src/content/docs structure
      locales: {
        pt: {
          label: 'Português',
          lang: 'pt-BR',
        },
        en: {
          label: 'English',
          lang: 'en',
        },
      },
      defaultLocale: 'pt',
      sidebar: [
        { label: 'eBooks', slug: 'books' },
        { label: 'Loja', slug: 'shop' },
        { label: 'Blog', slug: 'blog' },
        {
          label: 'Artigos Técnicos',
          items: [
            { label: 'Clean Code', slug: 'artigos-tecnicos/clean-code' },
            { label: 'SRE', slug: 'artigos-tecnicos/sre' },
            { label: 'Big-O', slug: 'artigos-tecnicos/bigo' },
          ],
        },
        {
          label: 'Referência',
          items: [
            { label: 'Notas de Arquitetura', slug: 'reference/architecture' },
            { label: 'Padrões de Engenharia', slug: 'reference/standards' },
            { label: 'Estruturas de Dados e Algoritmos', slug: 'reference/dsa' },
          ],
        },
        {
          label: 'Tutoriais',
          items: [
            { label: 'Hello World no C++', slug: 'tutorials/hello-world-cpp' },
          ],
        },
        { label: 'Projetos', slug: 'projects' },
      ],
    }),
  ],
});