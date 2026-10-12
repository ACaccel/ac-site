import Typography from '@mui/material/Typography';

/** Placeholder for a list with no entries yet; render inside a ThemeRoot. */
export default function EmptyState({ children }: { children: string }) {
  return (
    <Typography color="text.secondary" sx={{ py: 2 }}>
      {children}
    </Typography>
  );
}
