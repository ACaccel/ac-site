import ArrowOutward from '@mui/icons-material/ArrowOutward';
import GitHub from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Service } from '../data/services';

const statusChip = {
  active: { label: '運作中', color: 'success' },
  beta: { label: '測試中', color: 'warning' },
  archived: { label: '已封存', color: 'default' },
} as const;

interface Props {
  service: Service;
  /** Adds the path and technology chips, for /services/. */
  detailed?: boolean;
}

/**
 * Services are apps to use, not pages to read, so they get an explicit open button instead of
 * a whole-card link. Render inside a ThemeRoot.
 */
export default function ServiceCard({ service, detailed = false }: Props) {
  const status = statusChip[service.status];
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h3" component="h3">
            {service.name}
          </Typography>
          <Chip size="small" variant="outlined" label={status.label} color={status.color} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {service.description}
        </Typography>
        {detailed && (
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, fontFamily: 'monospace' }}
            >
              {service.path}
            </Typography>
            {service.stack.length > 0 && (
              <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                {service.stack.map((item) => (
                  <Chip key={item} size="small" label={item} />
                ))}
              </Stack>
            )}
          </>
        )}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        {service.status !== 'archived' && (
          <Button variant="contained" size="small" href={service.path} endIcon={<ArrowOutward />}>
            開啟服務
          </Button>
        )}
        {service.source && (
          <Button size="small" href={service.source} rel="noopener" startIcon={<GitHub />}>
            原始碼
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
