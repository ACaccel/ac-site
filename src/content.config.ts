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
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.strictObject({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
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

export const collections = { services, posts, now };
