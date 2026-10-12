import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { formatPeriod } from './dates';
import type { Service } from './services';

export type Project = CollectionEntry<'projects'>;

/** Plain project fields for list components. */
export interface ProjectSummary {
  href: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  stack: string[];
}

/** Published projects, newest start first; drafts are included only in the dev server. */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection(
    'projects',
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return projects.sort((a, b) => b.data.start.localeCompare(a.data.start));
}

export function toProjectSummary(project: Project): ProjectSummary {
  const { title, summary, role, start, end, stack } = project.data;
  return {
    href: `/projects/${project.id}/`,
    title,
    summary,
    role,
    period: formatPeriod(start, end),
    stack,
  };
}

/** The service a project links to; a key missing from services.json fails the build. */
export async function getProjectService(project: Project): Promise<Service | undefined> {
  const key = project.data.service;
  if (!key) return undefined;
  const entry = await getEntry('services', key);
  if (!entry) {
    throw new Error(`Project "${project.id}" names unknown service "${key}" in services.json`);
  }
  return entry.data;
}
