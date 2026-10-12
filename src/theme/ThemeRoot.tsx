import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

/**
 * Astro renders every React component as its own root, so each root needs the theme.
 * Components never hydrate; this only affects the generated HTML and styles.
 */
export default function ThemeRoot({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
