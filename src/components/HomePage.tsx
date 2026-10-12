import ArrowForward from '@mui/icons-material/ArrowForward';
import GitHub from '@mui/icons-material/GitHub';
import Link from '@mui/icons-material/Link';
import MailOutlined from '@mui/icons-material/MailOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import NowCard, { type NowSummary } from './NowCard';
import PostCard from './PostCard';
import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import { profile } from '../data/profile';
import type { PostSummary } from '../data/posts';
import type { Service } from '../data/services';

interface Props {
  now?: NowSummary | undefined;
  posts: PostSummary[];
  services: Service[];
}

const sectionSx = { mt: { xs: 6, md: 8 } };

export default function HomePage({ now, posts, services }: Props) {
  return (
    <ThemeRoot>
      <Box component="section" sx={{ py: { xs: 2, md: 4 } }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' } }}>
          {profile.name}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 640, fontSize: '1.125rem' }}>
          {profile.tagline}
        </Typography>
        <Stack direction="row" useFlexGap sx={{ mt: 4, flexWrap: 'wrap', gap: 1.5 }}>
          {profile.links.map((link) => (
            <Button
              key={link.href}
              variant="outlined"
              href={link.href}
              rel="me noopener"
              startIcon={link.label === 'GitHub' ? <GitHub /> : <Link />}
            >
              {link.label}
            </Button>
          ))}
          {profile.email && (
            <Button
              variant="outlined"
              href={`mailto:${profile.email}`}
              startIcon={<MailOutlined />}
            >
              Email
            </Button>
          )}
          <Button href="/about/" endIcon={<ArrowForward />}>
            關於我
          </Button>
        </Stack>
      </Box>

      {now && (
        <Box sx={sectionSx}>
          <NowCard now={now} />
        </Box>
      )}

      {posts.length > 0 && (
        <Box component="section" aria-labelledby="posts-heading" sx={sectionSx}>
          <SectionHeader
            id="posts-heading"
            title="最新文章"
            more={{ href: '/posts/', label: '所有文章' }}
          />
          <CardGrid>
            {posts.map((post) => (
              <li key={post.href}>
                <PostCard post={post} />
              </li>
            ))}
          </CardGrid>
        </Box>
      )}

      <Box component="section" aria-labelledby="services-heading" sx={sectionSx}>
        <SectionHeader
          id="services-heading"
          title="服務"
          more={{ href: '/services/', label: '所有服務' }}
        />
        <CardGrid>
          {services.map((service) => (
            <li key={service.path}>
              <ServiceCard service={service} />
            </li>
          ))}
        </CardGrid>
      </Box>
    </ThemeRoot>
  );
}
