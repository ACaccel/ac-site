import { text } from './text';

// Front matter dates have no time zone and parse as UTC midnight, so format them in UTC.
const dateFormat = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** `YYYY-MM-DD`, for `<time datetime>`. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const yearMonthFormat = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

function formatYearMonth(value: string): string {
  return yearMonthFormat.format(new Date(`${value}-01T00:00:00Z`));
}

/** `YYYY-MM` range; a missing end shows the "present" text from site.yaml. */
export function formatPeriod(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : text.about.present}`;
}
