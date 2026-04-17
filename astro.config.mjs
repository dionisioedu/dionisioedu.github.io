import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/',
  output: 'static',
  integrations: [
    starlight({
      title: 'Dionisio Developer',
      description:
        'Portfolio, blog, store, and technical reference by @dionisiodev on software engineering, applied AI, products, and career growth.',
      components: {
        Footer: './src/components/DocsFooter.astro',
        Head: './src/components/DocsHead.astro',
        PageTitle: './src/components/DocsPageTitle.astro',
        PageSidebar: './src/components/PageSidebar.astro',
      },
      customCss: ['./src/styles/global.css'],
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
      ],
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
              label: 'Blog',
              items: [
                { label: 'Will AI End Developer Jobs?', link: 'artigos-tecnicos/ia-vai-acabar-com-os-devs/' },
                { label: 'Clean Code', link: 'artigos-tecnicos/clean-code/' },
                { label: 'SRE', link: 'artigos-tecnicos/sre/' },
                { label: 'Big-O', link: 'artigos-tecnicos/bigo/' },
              ],
            },
            {
              label: 'Guides',
              items: [
                { label: 'Overview', link: 'reference/' },
                { label: 'Where to Start?', link: 'reference/getting-started/' },
                { label: 'Programming Logic', link: 'reference/logica-de-programacao/' },
                { label: 'Data Types', link: 'reference/tipos-de-dados/' },
                { label: 'Data Structures', link: 'reference/estruturas-de-dados/' },
                { label: 'Algorithms', link: 'reference/algoritmos/' },
                { label: 'ASCII Table', link: 'reference/tabela-ascii/' },
                { label: 'Resume That Stands Out', link: 'reference/curriculo-que-se-destaca/' },
              ],
            },
            {
              label: 'Labs',
              items: [{ label: 'Code Lab', link: 'reference/code-lab/' }],
            },
            {
              label: 'Portfolio',
              items: [
                { label: 'Overview', link: 'projects/' },
                { label: 'SportPulse.today', link: 'projects/sportpulse/' },
                { label: 'Amorfy', link: 'projects/amorfy/' },
                { label: 'Wheel Of List', link: 'projects/wheel-of-list/' },
              ],
            },
            {
              label: 'Tutorials',
              items: [{ label: 'Hello World in C++', link: 'tutorials/hello-world-cpp/' }],
            },
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
          label: 'Blog',
          items: [
            { label: 'RAG local com PDFs', link: 'artigos-tecnicos/rag-local-com-pdfs/' },
            { label: 'n8n grátis na Oracle Cloud', link: 'artigos-tecnicos/n8n-gratis-oracle-cloud/' },
            { label: 'IA Vai Acabar com os Devs?', link: 'artigos-tecnicos/ia-vai-acabar-com-os-devs/' },
            { label: 'Clean Code', link: 'artigos-tecnicos/clean-code/' },
            { label: 'SRE', link: 'artigos-tecnicos/sre/' },
            { label: 'Big-O', link: 'artigos-tecnicos/bigo/' },
          ],
        },
        {
          label: 'Guias',
          items: [
            { label: 'Visão geral', link: 'reference/' },
            { label: 'Por Onde Começar?', link: 'reference/getting-started/' },
            { label: 'Lógica de Programação', link: 'reference/logica-de-programacao/' },
            { label: 'Tipos de Dados', link: 'reference/tipos-de-dados/' },
            { label: 'Estruturas de Dados', link: 'reference/estruturas-de-dados/' },
            { label: 'Algoritmos', link: 'reference/algoritmos/' },
            { label: 'Tabela ASCII', link: 'reference/tabela-ascii/' },
            { label: 'Currículo Que Se Destaca', link: 'reference/curriculo-que-se-destaca/' },
          ],
        },
        {
          label: 'Labs',
          items: [{ label: 'Code Lab', link: 'reference/code-lab/' }],
        },
        {
          label: 'Portfólio',
          items: [
            { label: 'Visão geral', link: 'projects/' },
            { label: 'SportPulse.today', link: 'projects/sportpulse/' },
            { label: 'Amorfy', link: 'projects/amorfy/' },
            { label: 'Wheel Of List', link: 'projects/wheel-of-list/' },
          ],
        },
        {
          label: 'Tutoriais',
          items: [{ label: 'Hello World no C++', link: 'tutorials/hello-world-cpp/' }],
        },
        {
          label: 'eBooks',
          items: [
            { label: 'Guia do Dev Iniciante', link: 'ebooks/guia-do-dev-iniciante/' },
            { label: 'Guia Avançado C++', link: 'ebooks/guia-avancado-cpp/' },
          ],
        },
        { label: 'Loja', link: 'shop/' },
      ],
    }),
  ],
});
