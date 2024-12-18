import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [tailwind(), react()],
  i18n: {
    defaultLocale: 'fa',
    locales: ['fa', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});