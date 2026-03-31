import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/',
  output: 'static',
  integrations: [
    starlight({
      title: 'Developers Hub',
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
        {
          tag: 'script',
          attrs: {
            async: true,
            src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6858130394830057',
            crossorigin: 'anonymous',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:type',
            content: 'website',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://dionisio.dev/assets/images/banner.jpg',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1440',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '900',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://dionisio.dev/assets/images/banner.jpg',
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
          sidebar: [
            {
              label: 'eBooks',
              items: [
                { label: 'Beginner Dev Guide', slug: 'ebooks/beginner-dev-guide' },
                { label: 'Advanced C++ Guide', slug: 'ebooks/advanced-cpp-guide' }
              ],
            },
            { label: 'Shop', slug: 'shop' },
            { label: 'Blog', slug: 'blog' },
            {
              label: 'Technical Articles',
              items: [
                { label: 'IA Vai Acabar com os Devs?', slug: 'artigos-tecnicos/ia-vai-acabar-com-os-devs' },
                { label: 'Clean Code', slug: 'artigos-tecnicos/clean-code' },
                { label: 'SRE', slug: 'artigos-tecnicos/sre' },
                { label: 'Big-O', slug: 'artigos-tecnicos/bigo' },
              ],
            },
            {
              label: 'Reference',
              items: [
                { label: 'Where to Start?', slug: 'reference/getting-started' },
                { label: 'Data Types', slug: 'reference/tipos-de-dados' },
                { label: 'Data Structures', slug: 'reference/estruturas-de-dados' },
                { label: 'Programming Logic', slug: 'reference/logica-de-programacao' },
                { label: 'Algorithms', slug: 'reference/algoritmos' },
                { label: 'Data Structures & Algorithms', slug: 'reference/dsa' },
                { label: 'Resume That Stands Out', slug: 'reference/curriculo-que-se-destaca' },
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
      sidebar: [
        {
          label: 'eBooks',
          items: [
            { label: 'Guia do Dev Iniciante', slug: 'ebooks/guia-do-dev-iniciante' },
            { label: 'Guia Avançado C++', slug: 'ebooks/guia-avancado-cpp' }
          ],
        },
        { label: 'Shop', slug: 'shop' },
        { label: 'Blog', slug: 'blog' },
        {
          label: 'Artigos Técnicos',
          items: [
            { label: 'IA Vai Acabar com os Devs?', slug: 'artigos-tecnicos/ia-vai-acabar-com-os-devs' },
            { label: 'Clean Code', slug: 'artigos-tecnicos/clean-code' },
            { label: 'SRE', slug: 'artigos-tecnicos/sre' },
            { label: 'Big-O', slug: 'artigos-tecnicos/bigo' },
          ],
        },
        {
          label: 'Referência',
          items: [
            { label: 'Por Onde Começar?', slug: 'reference/getting-started' },
            { label: 'Tipos de Dados', slug: 'reference/tipos-de-dados' },
            { label: 'Estruturas de Dados', slug: 'reference/estruturas-de-dados' },
            { label: 'Lógica de Programação', slug: 'reference/logica-de-programacao' },
            { label: 'Algoritmos', slug: 'reference/algoritmos' },
            { label: 'Estruturas de Dados e Algoritmos', slug: 'reference/dsa' },
            { label: 'Currículo Que Se Destaca', slug: 'reference/curriculo-que-se-destaca' },
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
