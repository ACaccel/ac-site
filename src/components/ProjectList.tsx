import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import ProjectCard from './ProjectCard';
import type { ProjectSummary } from '../data/projects';

export default function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ThemeRoot>
      {projects.length > 0 ? (
        <CardGrid columns={2}>
          {projects.map((project) => (
            <li key={project.href}>
              <ProjectCard project={project} />
            </li>
          ))}
        </CardGrid>
      ) : (
        <EmptyState>作品介紹準備中。</EmptyState>
      )}
    </ThemeRoot>
  );
}
