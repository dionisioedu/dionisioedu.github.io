import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/',
  output: 'static',
  i18n: {
    locales: ['en', 'pt'],
    defaultLocale: 'pt',
  },
  integrations: [
    starlight({
      title: 'Developers Hub',
      description: 'A reference hub for developers: wiki, tools, and tech radar.',
    }),
  ],
});