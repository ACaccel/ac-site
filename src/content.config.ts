import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
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

export const collections = { services };
