import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Chinese characters, CJK punctuation, and full-width forms.
const cjk = '[\\u3000-\\u303f\\u4e00-\\u9fff\\uff00-\\uffef]';

export default defineConfig(
  { ignores: ['dist/', '.astro/', '.conda/'] },
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    // Visible text lives in src/content/site.yaml so it can be edited in one place.
    files: ['src/**/*.{ts,tsx,astro}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        ...['Literal[value', 'TemplateElement[value.raw', 'JSXText[value'].map((node) => ({
          selector: `${node}=/${cjk}/]`,
          message: 'Move this text to src/content/site.yaml and read it through `text`.',
        })),
      ],
    },
  },
);
