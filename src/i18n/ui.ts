export const locales = ['zh-TW', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'zh-TW';

const ui = {
  'zh-TW': {
    'site.description': 'ACaccel 的個人網站，以及部署在 acserver.csie.org 上的服務。',
    'intro.body':
      '目前在臺灣大學電機工程學系，主要從事軟體開發與伺服器維運。本站列出部署於此主機的公開服務。',
    'services.heading': '服務',
    'services.source': '原始碼',
    'links.heading': '連結',
    'lang.switch': 'English',
  },
  en: {
    'site.description': "ACaccel's personal website and the services hosted on acserver.csie.org.",
    'intro.body':
      'Based at the Department of Electrical Engineering, National Taiwan University, working on software development and server operations. This site lists the public services hosted on this server.',
    'services.heading': 'Services',
    'services.source': 'Source',
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
