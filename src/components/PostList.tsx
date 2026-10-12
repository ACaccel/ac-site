import Stack from '@mui/material/Stack';
import ThemeRoot from '../theme/ThemeRoot';
import EmptyState from './EmptyState';
import PostCard from './PostCard';
import type { PostSummary } from '../data/posts';

export default function PostList({ posts }: { posts: PostSummary[] }) {
  return (
    <ThemeRoot>
      {posts.length > 0 ? (
        <Stack component="ul" sx={{ gap: 2, m: 0, p: 0, listStyle: 'none' }}>
          {posts.map((post) => (
            <li key={post.href}>
              <PostCard post={post} />
            </li>
          ))}
        </Stack>
      ) : (
        <EmptyState>目前還沒有文章。</EmptyState>
      )}
    </ThemeRoot>
  );
}
