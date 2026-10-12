import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';

interface Props {
  title: string;
  description?: string;
  /** Extra lines under the title, such as dates or chips. */
  children?: ReactNode;
}

export default function PageHeader({ title, description, children }: Props) {
  return (
    <ThemeRoot>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="h1">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            {description}
          </Typography>
        )}
        {children && <Box sx={{ mt: 1.5, color: 'text.secondary' }}>{children}</Box>}
      </Box>
    </ThemeRoot>
  );
}
