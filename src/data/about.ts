import { getCollection } from 'astro:content';

export interface Experience {
  id: string;
  title: string;
  organization: string;
  period: string;
  description?: string | undefined;
}

function formatYearMonth(value: string): string {
  const [year, month] = value.split('-');
  return `${year}年${Number(month)}月`;
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
      period: `${formatYearMonth(data.start)} – ${data.end ? formatYearMonth(data.end) : '現在'}`,
      description: data.description,
    }));
}
