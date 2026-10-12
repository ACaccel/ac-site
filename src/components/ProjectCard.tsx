import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { ProjectSummary } from '../data/projects';

/** Project entry linking to its case study; render inside a ThemeRoot. */
export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={project.href} sx={{ height: '100%', alignItems: 'flex-start' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {project.period} · {project.role}
          </Typography>
          <Typography variant="h3" component="h3" sx={{ mt: 0.5 }}>
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {project.summary}
          </Typography>
          {project.stack.length > 0 && (
            <Typography variant="caption" color="primary" component="p" sx={{ mt: 1.5 }}>
              {project.stack.join(' · ')}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
