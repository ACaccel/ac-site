import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { text } from '../data/text';
import { getPosts, postHref } from '../data/posts';

export async function GET(context: APIContext) {
  if (!context.site) throw new Error('Set `site` in astro.config.mjs to build the RSS feed.');
  const posts = await getPosts();
  return rss({
    title: text.posts.rssTitle,
    description: site.description,
    site: context.site,
    trailingSlash: true,
    customData: '<language>zh-TW</language>',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post),
      categories: post.data.tags,
    })),
  });
}
