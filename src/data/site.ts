import { text } from './text';

export interface NavItem {
  label: string;
  href: string;
}

/** Site-wide settings; texts come from content/site.yaml. */
export const site = {
  description: text.site.description,
  sourceUrl: text.site.sourceUrl,
  nav: [
    { label: text.nav.posts, href: '/posts/' },
    { label: text.nav.hobbies, href: '/hobbies/' },
    { label: text.nav.projects, href: '/projects/' },
    { label: text.nav.services, href: '/services/' },
    { label: text.nav.about, href: '/about/' },
  ] satisfies NavItem[],
};

/** Document title for a page other than the homepage. */
export function pageTitle(title: string): string {
  return `${title} | ${text.profile.name}`;
}

/** True when `pathname` is the nav target or a page below it. */
export function isActiveNav(item: NavItem, pathname: string): boolean {
  return pathname.startsWith(item.href);
}
