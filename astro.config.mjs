import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://dionisio.dev',
  base: '/',
  integrations: [
    starlight({
      title: 'Dionisio Dev Hub',
      description: 'A reference hub for developers: wiki, tools, and tech radar.'
    }),
  ],
});