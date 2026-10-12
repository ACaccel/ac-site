import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://acserver.csie.org',
  trailingSlash: 'always',
  build: {
    // External stylesheets keep the CSP free of 'unsafe-inline'.
    inlineStylesheets: 'never',
  },
  markdown: {
    // Prism marks tokens with classes; Shiki's inline styles would be blocked by the CSP.
    syntaxHighlight: 'prism',
  },
});
