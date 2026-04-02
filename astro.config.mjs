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
            content: 'https://dionisio.dev/assets/images/social-card.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630',
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
            content: 'https://dionisio.dev/assets/images/social-card.png',
          },
        },
      ],

      // i18n - automatically infer from src/content/docs structure
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
              label: 'Reference',
              items: [
                { label: 'Overview', link: 'reference/' },
                { label: 'Where to Start?', link: 'reference/getting-started/' },
                { label: 'Data Types', link: 'reference/tipos-de-dados/' },
                { label: 'ASCII Table', link: 'reference/tabela-ascii/' },
                { label: 'Code Lab', link: 'reference/code-lab/' },
                { label: 'Data Structures', link: 'reference/estruturas-de-dados/' },
                { label: 'Programming Logic', link: 'reference/logica-de-programacao/' },
                { label: 'Algorithms', link: 'reference/algoritmos/' },
                { label: 'Resume That Stands Out', link: 'reference/curriculo-que-se-destaca/' },
              ],
            },
            {
              label: 'Technical Articles',
              items: [
                { label: 'Overview', link: 'artigos-tecnicos/' },
                { label: 'Will AI End Developer Jobs?', link: 'artigos-tecnicos/ia-vai-acabar-com-os-devs/' },
                { label: 'Clean Code', link: 'artigos-tecnicos/clean-code/' },
                { label: 'SRE', link: 'artigos-tecnicos/sre/' },
                { label: 'Big-O', link: 'artigos-tecnicos/bigo/' },
              ],
            },
            {
              label: 'Tutorials',
              items: [
                { label: 'Hello World in C++', link: 'tutorials/hello-world-cpp/' },
              ],
            },
            {
              label: 'Projects',
              items: [
                { label: 'Overview', link: 'projects/' },
                { label: 'SportPulse.today', link: 'projects/sportpulse/' },
                { label: 'Amorfy', link: 'projects/amorfy/' },
                { label: 'Wheel Of List', link: 'projects/wheel-of-list/' },
              ],
            },
            { label: 'Blog', link: 'blog/' },
            {
              label: 'eBooks',
              items: [
                { label: 'Beginner Dev Guide', link: 'ebooks/beginner-dev-guide/' },
                { label: 'Advanced C++ Guide', link: 'ebooks/advanced-cpp-guide/' },
              ],
            },
            { label: 'Shop', link: 'shop/' },
          ],
        },
      },
      defaultLocale: 'pt',
      sidebar: [
        {
          label: 'Referência',
          items: [
            { label: 'Visão geral', link: 'reference/' },
            { label: 'Por Onde Começar?', link: 'reference/getting-started/' },
            { label: 'Tipos de Dados', link: 'reference/tipos-de-dados/' },
            { label: 'Tabela ASCII', link: 'reference/tabela-ascii/' },
            { label: 'Code Lab', link: 'reference/code-lab/' },
            { label: 'Estruturas de Dados', link: 'reference/estruturas-de-dados/' },
            { label: 'Lógica de Programação', link: 'reference/logica-de-programacao/' },
            { label: 'Algoritmos', link: 'reference/algoritmos/' },
            { label: 'Currículo Que Se Destaca', link: 'reference/curriculo-que-se-destaca/' },
          ],
        },
        {
          label: 'Artigos Técnicos',
          items: [
            { label: 'Visão geral', link: 'artigos-tecnicos/' },
            { label: 'IA Vai Acabar com os Devs?', link: 'artigos-tecnicos/ia-vai-acabar-com-os-devs/' },
            { label: 'Clean Code', link: 'artigos-tecnicos/clean-code/' },
            { label: 'SRE', link: 'artigos-tecnicos/sre/' },
            { label: 'Big-O', link: 'artigos-tecnicos/bigo/' },
          ],
        },
        {
          label: 'Tutoriais',
          items: [
            { label: 'Hello World no C++', link: 'tutorials/hello-world-cpp/' },
          ],
        },
        {
          label: 'Projetos',
          items: [
            { label: 'Visão geral', link: 'projects/' },
            { label: 'SportPulse.today', link: 'projects/sportpulse/' },
            { label: 'Amorfy', link: 'projects/amorfy/' },
            { label: 'Wheel Of List', link: 'projects/wheel-of-list/' },
          ],
        },
        { label: 'Blog', link: 'blog/' },
        {
          label: 'eBooks',
          items: [
            { label: 'Guia do Dev Iniciante', link: 'ebooks/guia-do-dev-iniciante/' },
            { label: 'Guia Avançado C++', link: 'ebooks/guia-avancado-cpp/' },
          ],
        },
        { label: 'Shop', link: 'shop/' },
      ],
    }),
  ],
});
