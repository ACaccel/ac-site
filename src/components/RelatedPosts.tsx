import Box from '@mui/material/Box';
import CardGrid from './CardGrid';
import PostCard from './PostCard';
import SectionHeader from './SectionHeader';
import { tagHref, type PostSummary } from '../data/posts';
import { text } from '../data/text';

interface Props {
  posts: PostSummary[];
  /** Links to the tag page when set. */
  tag?: string | undefined;
}

/** Write-ups related to a hobby; renders nothing without posts. Render inside a ThemeRoot. */
export default function RelatedPosts({ posts, tag }: Props) {
  if (posts.length === 0) return null;
  return (
    <Box component="section" aria-labelledby="related-heading" sx={{ mt: 8 }}>
      <SectionHeader
        id="related-heading"
        title={text.hobbies.relatedPosts}
        more={tag ? { href: tagHref(tag), label: `#${tag}` } : undefined}
      />
      <CardGrid>
        {posts.map((post) => (
          <li key={post.href}>
            <PostCard post={post} />
          </li>
        ))}
      </CardGrid>
    </Box>
  );
}
