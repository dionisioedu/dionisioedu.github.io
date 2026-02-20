import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/', // user site (dionisioedu.github.io), então é raiz mesmo
  integrations: [
    starlight({
      title: 'Dionisio Dev Hub',
      description: 'A reference hub for developers: wiki, tools, and tech radar.',
      // i18n do Starlight
      locales: {
        // root locale = pt (pra manter sua base atual)
        pt: { label: 'Português', lang: 'pt-BR' },
        en: { label: 'English', lang: 'en' },
      },
      defaultLocale: 'pt',
      // sidebar vai ficar no starlight.config.ts
    }),
  ],
});