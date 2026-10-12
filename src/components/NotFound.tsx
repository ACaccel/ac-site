import ArrowBack from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import { text } from '../data/text';

export default function NotFound() {
  return (
    <ThemeRoot>
      <Typography variant="h1">404</Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        {text.notFound.message}
      </Typography>
      <Button variant="outlined" href="/" startIcon={<ArrowBack />} sx={{ mt: 4 }}>
        {text.notFound.home}
      </Button>
    </ThemeRoot>
  );
}
