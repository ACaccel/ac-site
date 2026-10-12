import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, isoDate } from './dates';
import { getPosts, postHref, type Post } from './posts';

export type HobbyCategoryId = 'games' | 'media' | 'photos';

export interface HobbyCategory {
  id: HobbyCategoryId;
  title: string;
  description: string;
  href: string;
  /** Posts with this tag appear as related write-ups. */
  tag: string;
}

export const hobbyCategories: HobbyCategory[] = [
  {
    id: 'games',
    title: '遊戲',
    description: '玩過與正在玩的遊戲，附上簡短心得。',
    href: '/hobbies/games/',
    tag: 'games',
  },
  {
    id: 'media',
    title: '閱讀／動畫／影劇',
    description: '書、動畫與影劇的紀錄和短評。',
    href: '/hobbies/media/',
    tag: 'media',
  },
  {
    id: 'photos',
    title: '攝影／旅行',
    description: '旅行紀錄與照片。',
    href: '/hobbies/photos/',
    tag: 'travel',
  },
];

export function hobbyCategory(id: HobbyCategoryId): HobbyCategory {
  const category = hobbyCategories.find((entry) => entry.id === id);
  if (!category) throw new Error(`Unknown hobby category: ${id}`);
  return category;
}

export type StatusColor = 'primary' | 'success' | 'default';

/** Plain log entry fields for list components. */
export interface LogEntry {
  id: string;
  title: string;
  status: string;
  statusColor: StatusColor;
  /** Platform or creator. */
  meta?: string | undefined;
  note?: string | undefined;
  updated?: string | undefined;
  updatedISO?: string | undefined;
  postHref?: string | undefined;
  link?: string | undefined;
}

export interface LogGroup {
  id: string;
  title: string;
  entries: LogEntry[];
}

type LogData = CollectionEntry<'games'>['data'] | CollectionEntry<'media'>['data'];

/**
 * Resolves `post` to a link. An unknown id fails the build; a post that is still a draft is
 * skipped so the deployed entry never links to a missing page.
 */
function resolvePost(entry: LogData, posts: Post[], allPostIds: Set<string>): string | undefined {
  if (!entry.post) return undefined;
  if (!allPostIds.has(entry.post)) {
    throw new Error(`Hobby entry "${entry.id}" names unknown post "${entry.post}"`);
  }
  const post = posts.find((candidate) => candidate.id === entry.post);
  return post && postHref(post);
}

/** Newest update first; entries without a date go last, then by title. */
function byUpdated(a: LogData, b: LogData): number {
  const diff = (b.updated?.getTime() ?? 0) - (a.updated?.getTime() ?? 0);
  return diff || a.title.localeCompare(b.title, 'zh-TW');
}

async function loadPosts(): Promise<{ posts: Post[]; allPostIds: Set<string> }> {
  const posts = await getPosts();
  const allPostIds = new Set((await getCollection('posts')).map((post) => post.id));
  return { posts, allPostIds };
}

function toLogEntry(
  entry: LogData,
  status: { label: string; color: StatusColor },
  meta: string | undefined,
  postLink: string | undefined,
): LogEntry {
  return {
    id: entry.id,
    title: entry.title,
    status: status.label,
    statusColor: status.color,
    meta,
    note: entry.note,
    updated: entry.updated && formatDate(entry.updated),
    updatedISO: entry.updated && isoDate(entry.updated),
    postHref: postLink,
    link: entry.link,
  };
}

const gameStatuses = {
  playing: { label: '在玩', color: 'primary' },
  finished: { label: '玩完', color: 'success' },
  paused: { label: '擱置', color: 'default' },
} as const;

/** Games grouped by status in display order; empty groups are dropped. */
export async function getGameGroups(): Promise<LogGroup[]> {
  const games = (await getCollection('games')).map((entry) => entry.data).sort(byUpdated);
  const { posts, allPostIds } = await loadPosts();
  return (Object.keys(gameStatuses) as (keyof typeof gameStatuses)[])
    .map((status) => ({
      id: status,
      title: gameStatuses[status].label,
      entries: games
        .filter((game) => game.status === status)
        .map((game) =>
          toLogEntry(
            game,
            gameStatuses[status],
            game.platform,
            resolvePost(game, posts, allPostIds),
          ),
        ),
    }))
    .filter((group) => group.entries.length > 0);
}

const mediaTypes = { book: '書', anime: '動畫', drama: '影劇' } as const;

const mediaStatuses = {
  book: {
    'in-progress': { label: '閱讀中', color: 'primary' },
    finished: { label: '讀完', color: 'success' },
    paused: { label: '擱置', color: 'default' },
  },
  watch: {
    'in-progress': { label: '觀看中', color: 'primary' },
    finished: { label: '看完', color: 'success' },
    paused: { label: '擱置', color: 'default' },
  },
} as const;

const mediaStatusOrder = ['in-progress', 'finished', 'paused'] as const;

/** Media grouped by type; in progress first within each type. Empty groups are dropped. */
export async function getMediaGroups(): Promise<LogGroup[]> {
  const media = (await getCollection('media')).map((entry) => entry.data).sort(byUpdated);
  const { posts, allPostIds } = await loadPosts();
  return (Object.keys(mediaTypes) as (keyof typeof mediaTypes)[])
    .map((type) => {
      const statuses = mediaStatuses[type === 'book' ? 'book' : 'watch'];
      return {
        id: type,
        title: mediaTypes[type],
        entries: media
          .filter((item) => item.type === type)
          .sort((a, b) => mediaStatusOrder.indexOf(a.status) - mediaStatusOrder.indexOf(b.status))
          .map((item) =>
            toLogEntry(
              item,
              statuses[item.status],
              item.creator,
              resolvePost(item, posts, allPostIds),
            ),
          ),
      };
    })
    .filter((group) => group.entries.length > 0);
}

export type Album = CollectionEntry<'albums'>;

/** Published albums, newest first; drafts are included only in the dev server. */
export async function getAlbums(): Promise<Album[]> {
  const albums = await getCollection('albums', ({ data }) => import.meta.env.DEV || !data.draft);
  return albums.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Entry counts per category, for the hobbies overview. */
export async function getHobbyCounts(): Promise<Record<HobbyCategoryId, number>> {
  return {
    games: (await getCollection('games')).length,
    media: (await getCollection('media')).length,
    photos: (await getAlbums()).length,
  };
}
