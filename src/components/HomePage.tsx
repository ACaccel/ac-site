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
import HobbyCategoryCard from './HobbyCategoryCard';
import NowCard, { type NowSummary } from './NowCard';
import PostCard from './PostCard';
import ProjectCard from './ProjectCard';
import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import { profile } from '../data/profile';
import type { HobbyCategory } from '../data/hobbies';
import type { PostSummary } from '../data/posts';
import type { ProjectSummary } from '../data/projects';
import type { Service } from '../data/services';

interface Props {
  hobbies: HobbyCategory[];
  now?: NowSummary | undefined;
  posts: PostSummary[];
  projects: ProjectSummary[];
  services: Service[];
}

const sectionSx = { mt: { xs: 6, md: 8 } };

export default function HomePage({ hobbies, now, posts, projects, services }: Props) {
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

      <Box component="section" aria-labelledby="hobbies-heading" sx={sectionSx}>
        <SectionHeader
          id="hobbies-heading"
          title="興趣"
          more={{ href: '/hobbies/', label: '興趣專區' }}
        />
        <CardGrid>
          {hobbies.map((category) => (
            <li key={category.id}>
              <HobbyCategoryCard category={category} />
            </li>
          ))}
        </CardGrid>
      </Box>

      {projects.length > 0 && (
        <Box component="section" aria-labelledby="projects-heading" sx={sectionSx}>
          <SectionHeader
            id="projects-heading"
            title="精選作品"
            more={{ href: '/projects/', label: '所有作品' }}
          />
          <CardGrid columns={2}>
            {projects.map((project) => (
              <li key={project.href}>
                <ProjectCard project={project} />
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
