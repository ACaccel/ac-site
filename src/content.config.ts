import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const services = defineCollection({
  loader: file('src/content/services.json'),
  schema: z.strictObject({
    name: z.string().min(1),
    // A single path segment, matching how each service is mounted in nginx.
    path: z.string().regex(/^\/[a-z0-9-]+\/$/),
    description: z.string().min(1),
    source: z.url({ protocol: /^https$/ }).optional(),
    status: z.enum(['active', 'beta', 'archived']).default('active'),
    /** Main technologies, shown as chips on /services/. */
    stack: z.array(z.string().min(1)).default([]),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Lowercase slugs, used in /posts/tags/<tag>/ URLs.
    tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).default([]),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now.md', base: './src/content' }),
  schema: z.strictObject({
    /** Shown on the homepage card. */
    summary: z.string().min(1),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Year and month, such as 2024-09.
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

// Array entries in a data file carry their own id, which the file loader leaves in the data.
const entryId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

const experience = defineCollection({
  loader: file('src/content/experience.yaml'),
  schema: z.strictObject({
    id: entryId,
    title: z.string().min(1),
    organization: z.string().min(1),
    start: yearMonth,
    /** Omitted while ongoing. */
    end: yearMonth.optional(),
    description: z.string().min(1).optional(),
  }),
});

const link = z.strictObject({
  label: z.string().min(1),
  href: z.url({ protocol: /^https$/ }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.strictObject({
    title: z.string().min(1),
    summary: z.string().min(1),
    /** Your part in the project, such as 開發, 協作, or 代管. */
    role: z.string().min(1),
    start: yearMonth,
    end: yearMonth.optional(),
    stack: z.array(z.string().min(1)).default([]),
    links: z.array(link).default([]),
    /** Key of a related entry in services.json. */
    service: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, posts, now, experience, projects };
