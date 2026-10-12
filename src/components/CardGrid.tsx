import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface Props {
  /** Columns at the widest breakpoint; phones always get one column. */
  columns?: 2 | 3;
  children: ReactNode;
}

/** Responsive card grid; render inside a ThemeRoot. */
export default function CardGrid({ columns = 3, children }: Props) {
  return (
    <Box
      component="ul"
      sx={{
        display: 'grid',
        gap: 2,
        m: 0,
        p: 0,
        listStyle: 'none',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: `repeat(${columns}, minmax(0, 1fr))`,
        },
      }}
    >
      {children}
    </Box>
  );
}
