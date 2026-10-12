// Prepares album photos for the public repository: applies EXIF orientation, limits the size,
// and drops all metadata (camera, time, GPS). With --check, only reports files that need it.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import sharp from 'sharp';

const root = join(import.meta.dirname, '..', 'content', 'albums');
const maxSide = 2560;
const formats = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' };
const checkOnly = process.argv.includes('--check');

async function listPhotos(dir) {
  try {
    const entries = await readdir(dir, { recursive: true, withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() in formats)
      .map((entry) => join(entry.parentPath, entry.name));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function problems(metadata) {
  const found = [];
  for (const key of ['exif', 'xmp', 'iptc']) if (metadata[key]) found.push(key.toUpperCase());
  if (Math.max(metadata.width, metadata.height) > maxSide) found.push(`larger than ${maxSide}px`);
  return found;
}

const pending = [];
for (const file of await listPhotos(root)) {
  const input = await readFile(file);
  const found = problems(await sharp(input).metadata());
  if (found.length === 0) continue;
  const name = relative(process.cwd(), file);
  if (checkOnly) {
    pending.push(`${name}: ${found.join(', ')}`);
    continue;
  }
  const output = await sharp(input)
    .rotate()
    .resize({ width: maxSide, height: maxSide, fit: 'inside', withoutEnlargement: true })
    .toFormat(formats[extname(file).toLowerCase()], { quality: 88 })
    .toBuffer();
  await writeFile(file, output);
  console.log(`Prepared ${name} (removed ${found.join(', ')})`);
}

if (pending.length > 0) {
  console.error(pending.join('\n'));
  console.error('Run `npm run photos` before committing these photos.');
  process.exit(1);
}
if (checkOnly) console.log('Album photos have no metadata and fit the size limit.');
