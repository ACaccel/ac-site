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

function formatYearMonth(value: string): string {
  const [year, month] = value.split('-');
  return `${year}年${Number(month)}月`;
}

/** `YYYY-MM` range such as `2024年9月 – 現在`; a missing end means ongoing. */
export function formatPeriod(start: string, end?: string): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : '現在'}`;
}
