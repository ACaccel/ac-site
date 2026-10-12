import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** Optimized image attributes for components that cannot use Astro's <Image>. */
export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

// Re-encoding also drops EXIF metadata, including GPS location.
export async function responsiveImage(
  source: ImageMetadata,
  widths: number[],
): Promise<ResponsiveImage> {
  const usable = widths.filter((width) => width <= source.width);
  const image = await getImage({
    src: source,
    widths: usable.length > 0 ? usable : [source.width],
    format: 'webp',
  });
  return {
    src: image.src,
    srcSet: image.srcSet.attribute,
    width: Number(image.attributes['width'] ?? source.width),
    height: Number(image.attributes['height'] ?? source.height),
  };
}

/** A single large rendition, for opening a photo on its own. */
export async function largeImage(source: ImageMetadata, maxWidth = 2000): Promise<string> {
  const image = await getImage({
    src: source,
    width: Math.min(maxWidth, source.width),
    format: 'webp',
  });
  return image.src;
}
