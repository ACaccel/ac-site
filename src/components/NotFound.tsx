import ArrowBack from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';

export default function NotFound() {
  return (
    <ThemeRoot>
      <Typography variant="h1">404</Typography>
      <Typography color="text.secondary" sx={{ mt: 2 }}>
        找不到這個頁面，可能已經移除或網址有誤。
      </Typography>
      <Button variant="outlined" href="/" startIcon={<ArrowBack />} sx={{ mt: 4 }}>
        回到首頁
      </Button>
    </ThemeRoot>
  );
}
