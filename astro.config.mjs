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
        },
        en: {
          label: 'English',
          lang: 'en',
          sidebar: [
            { label: 'eBooks', slug: 'books' },
            { label: 'Shop', slug: 'shop' },
            { label: 'Blog', slug: 'blog' },
            {
              label: 'Technical Articles',
              items: [
                { label: 'Clean Code', slug: 'artigos-tecnicos/clean-code' },
                { label: 'SRE', slug: 'artigos-tecnicos/sre' },
                { label: 'Big-O', slug: 'artigos-tecnicos/bigo' },
              ],
            },
            {
              label: 'Reference',
              items: [
                { label: 'Architecture Notes', slug: 'reference/architecture' },
                { label: 'Engineering Standards', slug: 'reference/standards' },
                { label: 'Data Structures & Algorithms', slug: 'reference/dsa' },
              ],
            },
            {
              label: 'Tutorials',
              items: [
                { label: 'Hello World in C++', slug: 'tutorials/hello-world-cpp' },
              ],
            },
            { label: 'Projects', slug: 'projects' },
          ],
        },
      },
      defaultLocale: 'pt',
    }),
  ],
});