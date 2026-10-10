export const locales = ['zh-TW', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-TW';

const ui = {
  'zh-TW': {
    'site.description': 'ACaccel 的個人網站，以及部署在 acserver.csie.org 上的服務。',
    'intro.greeting': '嗨，我是 ACaccel。',
    'intro.body':
      '目前在臺大電機，喜歡寫程式，也自己架伺服器。下面列出的服務都跑在這台主機上；最近在做 Discord bot 框架和多人線上遊戲。',
    'links.heading': '連結',
    'lang.switch': 'English',
  },
  en: {
    'site.description': "ACaccel's personal website and the services hosted on acserver.csie.org.",
    'intro.greeting': "Hi, I'm ACaccel.",
    'intro.body':
      "I'm at NTU EE in Taipei. I enjoy writing software and running my own server; every service listed below is hosted on this machine. Lately I've been building a Discord bot framework and multiplayer browser games.",
    'links.heading': 'Links',
    'lang.switch': '中文',
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)[typeof defaultLocale];

export function isLocale(value: string | undefined): value is Locale {
  return locales.some((locale) => locale === value);
}

export function useTranslations(locale: Locale): (key: UiKey) => string {
  return (key) => ui[locale][key];
}
