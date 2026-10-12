import { getCollection } from 'astro:content';
import { formatPeriod } from './dates';

export interface Experience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description?: string | undefined;
}

/** Experience entries, newest start first. */
export async function getExperience(): Promise<Experience[]> {
  const entries = await getCollection('experience');
  return entries
    .sort((a, b) => b.data.start.localeCompare(a.data.start))
    .map(({ id, data }) => ({
      id,
      title: data.title,
      organization: data.organization,
      period: formatPeriod(data.start, data.end),
      description: data.description,
    }));
}
