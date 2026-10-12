import { getEntry, type CollectionEntry } from 'astro:content';

export type Now = CollectionEntry<'now'>;

/** The Now page, or undefined while it is a draft outside the dev server. */
export async function getNow(): Promise<Now | undefined> {
  const now = await getEntry('now', 'now');
  if (!now || (now.data.draft && !import.meta.env.DEV)) return undefined;
  return now;
}
