import ArrowOutward from '@mui/icons-material/ArrowOutward';
import GitHub from '@mui/icons-material/GitHub';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Service } from '../data/services';
import { text } from '../data/text';

const statusColor = { active: 'success', beta: 'warning', archived: 'default' } as const;

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
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="h3" component="h3">
            {service.name}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            label={text.services.status[service.status]}
            color={statusColor[service.status]}
          />
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
      {/* Icon-only buttons; the label from site.yaml stays as tooltip and accessible name. */}
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        {service.status !== 'archived' && (
          <IconButton
            href={service.path}
            aria-label={text.services.open}
            title={text.services.open}
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <ArrowOutward />
          </IconButton>
        )}
        {service.source && (
          <IconButton
            href={service.source}
            rel="noopener"
            aria-label={text.services.source}
            title={text.services.source}
            color="primary"
          >
            <GitHub />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
}
