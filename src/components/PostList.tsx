import Stack from '@mui/material/Stack';
import ThemeRoot from '../theme/ThemeRoot';
import EmptyState from './EmptyState';
import PostCard from './PostCard';
import TagChips from './TagChips';
import type { PostSummary, TagCount } from '../data/posts';
import { text } from '../data/text';

interface Props {
  posts: PostSummary[];
  /** Tag filter shown above the list. */
  tags?: TagCount[];
  activeTag?: string;
}

export default function PostList({ posts, tags = [], activeTag }: Props) {
  return (
    <ThemeRoot>
      <TagChips tags={tags} active={activeTag} allHref="/posts/" />
      {posts.length > 0 ? (
        <Stack component="ul" sx={{ gap: 2, m: 0, p: 0, listStyle: 'none' }}>
          {posts.map((post) => (
            <li key={post.href}>
              <PostCard post={post} />
            </li>
          ))}
        </Stack>
      ) : (
        <EmptyState>{text.posts.empty}</EmptyState>
      )}
    </ThemeRoot>
  );
}
