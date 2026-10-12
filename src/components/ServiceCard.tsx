import GitHub from '@mui/icons-material/GitHub';
import ArrowOutward from '@mui/icons-material/ArrowOutward';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { Service } from '../data/services';

/**
 * Services are apps to use, not pages to read, so they get an explicit open button instead of
 * a whole-card link. Render inside a ThemeRoot.
 */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h3" component="h3">
          {service.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {service.description}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button variant="contained" size="small" href={service.path} endIcon={<ArrowOutward />}>
          開啟服務
        </Button>
        {service.source && (
          <Button size="small" href={service.source} rel="noopener" startIcon={<GitHub />}>
            原始碼
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
