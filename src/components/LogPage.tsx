import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ThemeRoot from '../theme/ThemeRoot';
import CardGrid from './CardGrid';
import EmptyState from './EmptyState';
import PageHeader from './PageHeader';
import RelatedPosts from './RelatedPosts';
import type { LogEntry, LogGroup } from '../data/hobbies';
import type { PostSummary } from '../data/posts';

interface Props {
  title: string;
  description: string;
  groups: LogGroup[];
  /** Adds chips linking to each group, for long pages. */
  groupNav?: boolean;
  relatedPosts: PostSummary[];
  relatedTag: string;
}

function LogCard({ entry }: { entry: LogEntry }) {
  const hasActions = entry.postHref || entry.link;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography variant="h3" component="h3">
            {entry.title}
          </Typography>
          <Chip size="small" variant="outlined" color={entry.statusColor} label={entry.status} />
        </Box>
        {(entry.meta || entry.updated) && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {entry.meta}
            {entry.meta && entry.updated && ' · '}
            {entry.updated && <time dateTime={entry.updatedISO}>{entry.updated}</time>}
          </Typography>
        )}
        {entry.note && (
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {entry.note}
          </Typography>
        )}
      </CardContent>
      {hasActions && (
        <CardActions sx={{ px: 2, pb: 2 }}>
          {entry.postHref && (
            <Button size="small" variant="outlined" href={entry.postHref}>
              閱讀心得
            </Button>
          )}
          {entry.link && (
            <Button size="small" href={entry.link} rel="noopener">
              相關連結
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
}

export default function LogPage(props: Props) {
  const { title, description, groups, groupNav = false, relatedPosts, relatedTag } = props;
  return (
    <ThemeRoot>
      <PageHeader title={title} description={description} />
      {groupNav && groups.length > 1 && (
        <Stack
          component="nav"
          aria-label="分類"
          direction="row"
          useFlexGap
          sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}
        >
          {groups.map((group) => (
            <Chip
              key={group.id}
              component="a"
              href={`#${group.id}`}
              clickable
              variant="outlined"
              label={`${group.title} (${group.entries.length})`}
            />
          ))}
        </Stack>
      )}
      {groups.length === 0 && <EmptyState>紀錄整理中。</EmptyState>}
      {groups.map((group) => (
        <Box
          component="section"
          key={group.id}
          aria-labelledby={group.id}
          sx={{ mt: 5, scrollMarginTop: '5rem' }}
        >
          <Typography variant="h2" id={group.id} sx={{ mb: 2, scrollMarginTop: '5rem' }}>
            {group.title}
          </Typography>
          <CardGrid>
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <LogCard entry={entry} />
              </li>
            ))}
          </CardGrid>
        </Box>
      ))}
      <RelatedPosts posts={relatedPosts} tag={relatedTag} />
    </ThemeRoot>
  );
}
