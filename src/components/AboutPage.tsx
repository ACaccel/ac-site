import type { ReactNode } from 'react';
import MailOutlined from '@mui/icons-material/MailOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import LinkIcon from './LinkIcon';
import PageHeader from './PageHeader';
import Prose from './Prose';
import { profile } from '../data/profile';
import type { Experience } from '../data/about';
import { text } from '../data/text';

interface Props {
  experience: Experience[];
  /** The rendered `about.md`. */
  children?: ReactNode;
}

const sectionSx = { mt: 6 };

export default function AboutPage({ experience, children }: Props) {
  return (
    <ThemeRoot>
      <PageHeader title={text.about.title} />
      <Prose>{children}</Prose>

      {experience.length > 0 && (
        <Box component="section" aria-labelledby="experience-heading" sx={sectionSx}>
          <Typography variant="h2" id="experience-heading" sx={{ mb: 2 }}>
            {text.about.experience}
          </Typography>
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
            {experience.map((entry) => (
              <Box
                component="li"
                key={entry.id}
                sx={{
                  py: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  '&:first-of-type': { borderTop: 0 },
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {entry.period}
                </Typography>
                <Typography variant="h3" component="h3" sx={{ mt: 0.5 }}>
                  {entry.title}
                </Typography>
                <Typography color="text.secondary">{entry.organization}</Typography>
                {entry.description && <Typography sx={{ mt: 1 }}>{entry.description}</Typography>}
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box component="section" aria-labelledby="contact-heading" sx={sectionSx}>
        <Typography variant="h2" id="contact-heading" sx={{ mb: 2 }}>
          {text.about.contact}
        </Typography>
        <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 1.5 }}>
          {profile.email && (
            <Button
              variant="outlined"
              href={`mailto:${profile.email}`}
              startIcon={<MailOutlined />}
            >
              {profile.email}
            </Button>
          )}
          {profile.links.map((link) => (
            <Button
              key={link.href}
              variant="outlined"
              href={link.href}
              rel="me noopener"
              startIcon={<LinkIcon href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
        {text.about.cvNote && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            {text.about.cvNote}
          </Typography>
        )}
      </Box>
    </ThemeRoot>
  );
}
