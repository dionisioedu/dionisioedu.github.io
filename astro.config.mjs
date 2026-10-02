import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {Map<string, Date>} normalised URL path -> last modification date */
const lastmodByPath = new Map();

const DOCS_DIR = fileURLToPath(new URL('./src/content/docs', import.meta.url));
const SITE_ORIGIN = 'https://dionisio.dev';

/** Recursively collect every `.md`/`.mdx` file under `dir`. */
function walkDocs(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkDocs(full));
    else if (/\.(md|mdx)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Builds a URL-path -> Date map from the `docs` collection frontmatter
 * (`updatedAt`, falling back to `publishedAt`). Reads the files directly from
 * disk so it does not depend on Vite's module runner (unavailable in this
 * build hook). Pages without a known date are left untouched so we never emit
 * a build-time timestamp that would churn the sitemap on every deployment.
 */
function collectLastmodDates(logger) {
  for (const file of walkDocs(DOCS_DIR)) {
    const source = readFileSync(file, 'utf8');
    // Only inspect the leading YAML frontmatter block.
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
    if (!match) continue;
    const frontmatter = match[1];
    const updated = /^\s*updatedAt:\s*(.+)$/m.exec(frontmatter);
    const published = /^\s*publishedAt:\s*(.+)$/m.exec(frontmatter);
    const raw = (updated?.[1] ?? published?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
    if (!raw) continue;
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) continue;
    // Content path relative to src/content/docs, e.g. `en/about.md` -> `/en/about/`.
    const id = relative(DOCS_DIR, file).replace(/\.(md|mdx)$/i, '').split(sep).join('/');
    lastmodByPath.set(`/${id}/`, date);
  }
  logger.info(`sitemap lastmod: resolved dates for ${lastmodByPath.size} docs entries`);
}

/** Inject `<lastmod>` into the `<url>` entries that have a known date. */
function injectLastmod(sitemapXml, logger) {
  let injected = 0;
  const updated = sitemapXml.replace(
    /<url><loc>([^<]+)<\/loc>/g,
    (full, loc) => {
      const path = loc.startsWith(SITE_ORIGIN)
        ? loc.slice(SITE_ORIGIN.length) || '/'
        : loc;
      const date = lastmodByPath.get(path);
      if (!date) return full;
      injected += 1;
      return `<url><loc>${loc}</loc><lastmod>${date.toISOString()}</lastmod>`;
    },
  );
  return { updated, injected };
}

/**
 * Populates `lastmodByPath` before the build and rewrites the sitemap that
 * Starlight's bundled `@astrojs/sitemap` integration writes to `dist`, so we
 * do not interfere with Starlight's own sitemap/i18n wiring.
 */
function sitemapLastmodData() {
  return {
    name: 'dionisio:sitemap-lastmod',
    hooks: {
      'astro:build:start'({ logger }) {
        try {
          collectLastmodDates(logger);
        } catch (error) {
          logger.warn(`sitemap lastmod: could not resolve dates (${error.message})`);
        }
      },
      'astro:build:done'({ dir, logger }) {
        const destDir = fileURLToPath(dir);
        const files = readdirSync(destDir).filter((name) => /^sitemap-\d+\.xml$/.test(name));
        let total = 0;
        for (const name of files) {
          const file = join(destDir, name);
          const { updated, injected } = injectLastmod(readFileSync(file, 'utf8'), logger);
          if (injected > 0) writeFileSync(file, updated);
          total += injected;
        }
        logger.info(`sitemap lastmod: added <lastmod> to ${total} sitemap URLs`);
      },
    },
  };
}

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
        Header: './src/components/DocsHeader.astro',
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
      ],
      locales: {
        pt: {
          label: 'Português',
          lang: 'pt-BR',
          sidebar: [
            {
              label: 'Blog',
              items: [
                { label: 'Corrotinas e Programação Assíncrona em C++', link: 'artigos-tecnicos/corrotinas-programacao-assincrona-cpp/' },
                { label: 'Paralelismo vs. Concorrência', link: 'artigos-tecnicos/paralelismo-vs-concorrencia/' },
                { label: 'C++ por Versão — Do C++98 ao C++26', link: 'artigos-tecnicos/cpp-versoes-features/' },
                { label: 'RAII — Ownership Como Tipo', link: 'artigos-tecnicos/raii/' },
                { label: 'Smart Pointers — unique, shared e weak', link: 'artigos-tecnicos/smart-pointers/' },
                { label: 'SDLC — O Ciclo de Vida do Desenvolvimento de Software', link: 'artigos-tecnicos/sdlc-reference/' },
            { label: 'C++ em High-Frequency Trading', link: 'artigos-tecnicos/cpp-hft-low-latency/' },
                { label: 'Cache Affinity — Por Que Seus Dados Não Devem Viajar', link: 'artigos-tecnicos/cache-affinity/' },
                { label: 'Vision Transformer com webcam', link: 'artigos-tecnicos/classificacao-imagens-vision-transformer/' },
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
                { label: 'Trilha C++', link: 'reference/trilha-cpp/' },
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
              label: 'Aplicações',
              collapsed: false,
              items: [{ label: 'Teste de Perfil Tech', link: 'labs/applications/career-quiz/' }],
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
            { label: 'Mentoria 1:1', link: 'mentoria/' },
            { label: 'Loja', link: 'shop/' },
            { label: 'Open Source', link: 'open-source/' },
            { label: 'Sobre', link: 'about/' },
          ],
        },
        en: {
          label: 'English',
          lang: 'en',
          sidebar: [
            {
              label: 'Blog',
              items: [
                { label: 'Coroutines and Asynchronous Programming in C++', link: 'artigos-tecnicos/corrotinas-programacao-assincrona-cpp/' },
                { label: 'Parallelism vs. Concurrency', link: 'artigos-tecnicos/paralelismo-vs-concorrencia/' },
                { label: 'C++ by Version — From C++98 to C++26', link: 'artigos-tecnicos/cpp-versoes-features/' },
                { label: 'RAII — Ownership as a Type', link: 'artigos-tecnicos/raii/' },
                { label: 'Smart Pointers — unique, shared, weak', link: 'artigos-tecnicos/smart-pointers/' },
                { label: 'SDLC — The Software Development Life Cycle', link: 'artigos-tecnicos/sdlc-reference/' },
                { label: 'C++ in High-Frequency Trading', link: 'artigos-tecnicos/cpp-hft-low-latency/' },
                { label: 'Cache Affinity — Why Data Shouldn\'t Travel', link: 'artigos-tecnicos/cache-affinity/' },
                { label: 'Real-Time Image Classification with ViT', link: 'artigos-tecnicos/classificacao-imagens-vision-transformer/' },
                { label: 'Local RAG with PDFs', link: 'artigos-tecnicos/rag-local-com-pdfs/' },
                { label: 'Install n8n Free on Oracle Cloud', link: 'artigos-tecnicos/n8n-gratis-oracle-cloud/' },
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
                { label: 'C++ learning path', link: 'reference/trilha-cpp/' },
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
              items: [
                { label: 'Code Lab', link: 'reference/code-lab/' },
              ],
            },
            {
              label: 'Applications',
              collapsed: false,
              items: [
                { label: 'Tech Profile Quiz', link: 'labs/applications/career-quiz/' },
              ],
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
            { label: 'Open Source', link: 'open-source/' },
            { label: 'About', link: 'about/' },
          ],
        },
      },
      defaultLocale: 'en',
      sidebar: [
        {
          label: 'Blog',
          items: [
            {
              label: 'Coroutines and Asynchronous Programming in C++',
              translations: { 'pt-BR': 'Corrotinas e Programação Assíncrona em C++' },
              link: 'artigos-tecnicos/corrotinas-programacao-assincrona-cpp/',
            },
            {
              label: 'Parallelism vs. Concurrency',
              translations: { 'pt-BR': 'Paralelismo vs. Concorrência' },
              link: 'artigos-tecnicos/paralelismo-vs-concorrencia/',
            },
            {
              label: 'C++ by Version — From C++98 to C++26',
              translations: { 'pt-BR': 'C++ por Versão — Do C++98 ao C++26' },
              link: 'artigos-tecnicos/cpp-versoes-features/',
            },
            { label: 'SDLC — The Software Development Life Cycle', link: 'artigos-tecnicos/sdlc-reference/' },
            { label: 'C++ in High-Frequency Trading', link: 'artigos-tecnicos/cpp-hft-low-latency/' },
            { label: 'Cache Affinity — Why Data Shouldn\'t Travel', link: 'artigos-tecnicos/cache-affinity/' },
            { label: 'Vision Transformer com webcam', link: 'artigos-tecnicos/classificacao-imagens-vision-transformer/' },
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
            { label: 'C++ learning path', translations: { 'pt-BR': 'Trilha C++' }, link: 'reference/trilha-cpp/' },
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
          items: [
            { label: 'Code Lab', link: 'reference/code-lab/' },
          ],
        },
        {
          label: 'Aplicações',
          collapsed: false,
          items: [
            { label: 'Teste de Perfil Tech', link: 'labs/applications/career-quiz/' },
          ],
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
            { label: 'Beginner Dev Guide', link: 'ebooks/beginner-dev-guide/' },
            { label: 'Advanced C++ Guide', link: 'ebooks/advanced-cpp-guide/' },
          ],
        },
        { label: 'Shop', link: 'shop/' },
        { label: 'Open Source', link: 'open-source/' },
        { label: 'About', link: 'about/' },
      ],
    }),
    sitemapLastmodData(),
  ],
});
