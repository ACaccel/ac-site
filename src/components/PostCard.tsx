import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { PostSummary } from '../data/posts';

/** Post entry linking to the article; render inside a ThemeRoot. */
export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={post.href} sx={{ height: '100%', alignItems: 'flex-start' }}>
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            component="time"
            dateTime={post.dateISO}
          >
            {post.date}
          </Typography>
          <Typography variant="h3" component="h3" sx={{ mt: 0.5 }}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {post.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
