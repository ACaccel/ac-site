import { getCollection, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>['data'];

// Paths that belong to this site and must not be claimed by a service; /en/ redirects to /.
const reservedPaths = new Set([
  '/_astro/',
  '/about/',
  '/en/',
  '/hobbies/',
  '/now/',
  '/posts/',
  '/projects/',
  '/services/',
]);

export async function getServices(): Promise<Service[]> {
  const services = (await getCollection('services')).map((entry) => entry.data);
  const seen = new Set<string>();
  for (const { name, path } of services) {
    if (reservedPaths.has(path) || seen.has(path)) {
      throw new Error(`Service "${name}" uses a reserved or duplicate path: ${path}`);
    }
    seen.add(path);
  }
  return services.sort((a, b) => a.name.localeCompare(b.name, 'en'));
}
