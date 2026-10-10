import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://acserver.csie.org',
  trailingSlash: 'always',
  build: {
    // External stylesheets keep the CSP free of 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
