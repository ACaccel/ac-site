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
  tags: string[];
}

export interface TagCount {
  tag: string;
  count: number;
}

/** Published posts, newest first; drafts are included only in the dev server. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function toPostSummary(post: Post): PostSummary {
  return {
    href: postHref(post),
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.date),
    dateISO: isoDate(post.data.date),
    tags: post.data.tags,
  };
}

export function postHref(post: Post): string {
  return `/posts/${post.id}/`;
}

export function tagHref(tag: string): string {
  return `/posts/tags/${tag}/`;
}

/** Tags by post count, then alphabetically. */
export function getTagCounts(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'en'));
}

export function postsWithTag(posts: Post[], tag: string): Post[] {
  return posts.filter((post) => post.data.tags.includes(tag));
}

// Typical silent reading speeds: Chinese characters and English words per minute.
const cjkPerMinute = 400;
const wordsPerMinute = 200;

/** Estimated reading time in whole minutes, at least 1. */
export function readingMinutes(markdown: string): number {
  const text = markdown.replace(/```[\s\S]*?```/g, '');
  const cjk = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu)?.length ?? 0;
  const words =
    text
      .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu, ' ')
      .match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
  return Math.max(1, Math.round(cjk / cjkPerMinute + words / wordsPerMinute));
}

/** The posts published just before and after `post` in a newest-first list. */
export function adjacentPosts(
  posts: Post[],
  post: Post,
): { older: Post | undefined; newer: Post | undefined } {
  const index = posts.findIndex((entry) => entry.id === post.id);
  return { older: posts[index + 1], newer: index > 0 ? posts[index - 1] : undefined };
}
