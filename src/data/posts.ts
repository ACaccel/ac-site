import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, isoDate } from './dates';

export type Post = CollectionEntry<'posts'>;

/** Plain post fields for list components. */
export interface PostSummary {
  href: string;
  title: string;
  description: string;
  date: string;
  dateISO: string;
}

/** Published posts, newest first; drafts are included only in the dev server. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function toPostSummary(post: Post): PostSummary {
  return {
    href: `/posts/${post.id}/`,
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.date),
    dateISO: isoDate(post.data.date),
  };
}
