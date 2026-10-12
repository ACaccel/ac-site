import { readFile, readdir, rm } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tiff']);
const textExtensions = new Set(['.html', '.css', '.js', '.xml', '.json', '.txt']);

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

/**
 * Astro copies every source image of a content collection into the build, even when pages only
 * use optimized renditions. Those copies keep the original size and metadata (including GPS)
 * and include photos of draft albums, so remove every image that no output file references.
 */
export default function pruneUnusedImages(): AstroIntegration {
  return {
    name: 'prune-unused-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await listFiles(root);
        const texts = await Promise.all(
          files
            .filter((file) => textExtensions.has(extname(file)))
            .map((file) => readFile(file, 'utf8')),
        );
        const corpus = texts.join('\n');
        const assets = join(root, '_astro');
        const unused = files.filter(
          (file) =>
            file.startsWith(assets) &&
            imageExtensions.has(extname(file).toLowerCase()) &&
            !corpus.includes(basename(file)),
        );
        await Promise.all(unused.map((file) => rm(file)));
        if (unused.length > 0) logger.info(`Removed ${unused.length} unreferenced source images`);
      },
    },
  };
}
