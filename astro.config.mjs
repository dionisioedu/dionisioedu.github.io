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
        { label: 'EBooks', slug: 'guides/books' },
        { label: 'Loja', slug: 'guides/shop' },
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