import type { ReactNode } from 'react';
import ArrowOutward from '@mui/icons-material/ArrowOutward';
import GitHub from '@mui/icons-material/GitHub';
import Link from '@mui/icons-material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import Prose from './Prose';
import type { ProjectSummary } from '../data/projects';
import type { Service } from '../data/services';

interface Props {
  project: ProjectSummary;
  links: { label: string; href: string }[];
  service?: Service | undefined;
  /** The rendered case study. */
  children?: ReactNode;
}

export default function ProjectDetail({ project, links, service, children }: Props) {
  const openService = service && service.status !== 'archived';
  return (
    <ThemeRoot>
      <Box component="header" sx={{ mb: 4 }}>
        <Typography variant="h1">{project.title}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, fontSize: '1.0625rem' }}>
          {project.summary}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {project.period} · 角色：{project.role}
        </Typography>
        {project.stack.length > 0 && (
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
            {project.stack.map((item) => (
              <Chip key={item} size="small" label={item} />
            ))}
          </Stack>
        )}
        {(openService || links.length > 0) && (
          <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
            {openService && (
              <Button variant="contained" href={service.path} endIcon={<ArrowOutward />}>
                開啟服務
              </Button>
            )}
            {links.map((link) => (
              <Button
                key={link.href}
                variant="outlined"
                href={link.href}
                rel="noopener"
                startIcon={link.label === 'GitHub' ? <GitHub /> : <Link />}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
      <Prose>{children}</Prose>
    </ThemeRoot>
  );
}
