import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { tagHref, type TagCount } from '../data/posts';

interface Props {
  tags: TagCount[];
  /** Highlighted tag, on its own tag page. */
  active?: string | undefined;
  /** Link for the "all posts" chip; omitted when not set. */
  allHref?: string;
}

/** Tag filter links; render inside a ThemeRoot. */
export default function TagChips({ tags, active, allHref }: Props) {
  if (tags.length === 0) return null;
  return (
    <Stack
      component="nav"
      aria-label="標籤"
      direction="row"
      useFlexGap
      sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}
    >
      {allHref && (
        <Chip
          component="a"
          href={allHref}
          clickable
          label="全部"
          color={active ? 'default' : 'primary'}
          variant={active ? 'outlined' : 'filled'}
        />
      )}
      {tags.map(({ tag, count }) => (
        <Chip
          key={tag}
          component="a"
          href={tagHref(tag)}
          clickable
          label={`#${tag} (${count})`}
          aria-current={tag === active ? 'page' : undefined}
          color={tag === active ? 'primary' : 'default'}
          variant={tag === active ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  );
}
