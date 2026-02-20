import { defineConfig } from '@astrojs/starlight/config';
import { i18nLoader } from '@astrojs/starlight/loaders';

export default defineConfig({
  title: 'Dionisio Dev Hub',
  i18n: {
    defaultLocale: 'pt',
    locales: {
      pt: { label: 'Português', lang: 'pt-BR' },
      en: { label: 'English', lang: 'en' },
    },
  },
  // Tradução de strings do UI (opcional, mas recomendo)
  loaders: [i18nLoader()],
  sidebar: [
    { label: 'Wiki', items: [
      { label: 'DSA', link: '/wiki/dsa/' },
      { label: 'System Design', link: '/wiki/system-design/' },
      { label: 'C++', link: '/wiki/cpp/' },
      { label: 'Linux', link: '/wiki/linux/' },
      { label: 'Robotics', link: '/wiki/robotics/' },
    ]},
    { label: 'Tech Radar', link: '/radar/' },
    { label: 'Playground', link: '/playground/' },
    { label: 'Projects', link: '/projects/' },
    { label: 'Videos', link: '/videos/' },
    { label: 'Learn', link: '/learn/' },
    { label: 'Resources', link: '/resources/' },
  ],
});