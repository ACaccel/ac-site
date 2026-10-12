export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  /** One-sentence introduction on the homepage; the full introduction is `about.md`. */
  tagline: string;
  links: ProfileLink[];
  /** Shown as a mailto link when set. */
  email?: string;
}

export const profile: Profile = {
  name: 'ACaccel',
  tagline: '目前在臺灣大學電機工程學系，主要從事軟體開發與伺服器維運。',
  links: [{ label: 'GitHub', href: 'https://github.com/ACaccel' }],
  email: 'acaccel8763@gmail.com',
};
