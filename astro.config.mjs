import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import pruneUnusedImages from './src/integrations/prune-unused-images';

export default defineConfig({
  site: 'https://acserver.csie.org',
  trailingSlash: 'always',
  integrations: [react(), pruneUnusedImages()],
  build: {
    // Keep Astro's CSS in cacheable external files.
    inlineStylesheets: 'never',
  },
  vite: {
    // Inlined scripts or data: URIs would be blocked by the CSP.
    build: { assetsInlineLimit: 0 },
  },
  markdown: {
    // Prism marks tokens with classes, colored in global.css to match the theme.
    syntaxHighlight: 'prism',
  },
});
