export interface NavItem {
  label: string;
  href: string;
}

export const site = {
  description:
    'ACaccel 的個人網站：文章、近況、興趣、作品，以及部署在 acserver.csie.org 上的服務。',
  sourceUrl: 'https://github.com/ACaccel/ac-site',
  nav: [
    { label: '文章', href: '/posts/' },
    { label: '興趣', href: '/hobbies/' },
    { label: '作品', href: '/projects/' },
    { label: '服務', href: '/services/' },
    { label: '關於', href: '/about/' },
  ] satisfies NavItem[],
};

/** True when `pathname` is the nav target or a page below it. */
export function isActiveNav(item: NavItem, pathname: string): boolean {
  return pathname.startsWith(item.href);
}
