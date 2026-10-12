import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ThemeRoot from '../theme/ThemeRoot';

/** Typography for rendered Markdown, which arrives as plain HTML. */
export default function Prose({ children }: { children?: ReactNode }) {
  return (
    <ThemeRoot>
      <Box
        className="prose"
        sx={{
          typography: 'body1',
          overflowWrap: 'break-word',
          '& h2, & h3': { mt: 5, mb: 1.5, scrollMarginTop: '5rem' },
          '& h2': { typography: 'h2' },
          '& h3': { typography: 'h3' },
          '& p, & ul, & ol, & blockquote, & pre, & table': { my: 2 },
          '& li + li': { mt: 0.5 },
          '& a': { color: 'primary.main', textUnderlineOffset: '0.2em' },
          '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1 },
          '& blockquote': {
            mx: 0,
            pl: 2,
            borderLeft: 3,
            borderColor: 'divider',
            color: 'text.secondary',
          },
          '& table': { borderCollapse: 'collapse', display: 'block', overflowX: 'auto' },
          '& th, & td': { px: 1.5, py: 0.75, border: 1, borderColor: 'divider' },
          '& :not(pre) > code': {
            px: 0.75,
            py: 0.25,
            borderRadius: 0.5,
            bgcolor: 'action.hover',
            fontSize: '0.9em',
          },
          '& pre': {
            position: 'relative',
            overflowX: 'auto',
            px: 2.5,
            py: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: '#141416',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          '& hr': { my: 4, border: 0, borderTop: 1, borderColor: 'divider' },
        }}
      >
        {children}
      </Box>
    </ThemeRoot>
  );
}
