import AutoStories from '@mui/icons-material/AutoStories';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SportsEsports from '@mui/icons-material/SportsEsports';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import type { HobbyCategory, HobbyCategoryId } from '../data/hobbies';

const icons: Record<HobbyCategoryId, typeof SportsEsports> = {
  games: SportsEsports,
  media: AutoStories,
  photos: PhotoCamera,
};

interface Props {
  category: HobbyCategory;
  /** Entry count text; omitted when not set. */
  countLabel?: string | undefined;
}

/** Link card for a hobby category; render inside a ThemeRoot. */
export default function HobbyCategoryCard({ category, countLabel }: Props) {
  const Icon = icons[category.id];
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea href={category.href} sx={{ height: '100%', alignItems: 'flex-start' }}>
        <CardContent>
          <Box
            sx={{
              display: 'inline-flex',
              p: 1,
              borderRadius: 1,
              color: 'primary.main',
              bgcolor: 'action.hover',
            }}
          >
            <Icon />
          </Box>
          <Typography variant="h3" component="h3" sx={{ mt: 1.5 }}>
            {category.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {category.description}
          </Typography>
          {countLabel && (
            <Typography variant="caption" color="primary" component="p" sx={{ mt: 1.5 }}>
              {countLabel}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
