export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  links: ProfileLink[];
  /** Shown as a mailto link when set. */
  email?: string;
}

export const profile: Profile = {
  name: 'ACaccel',
  links: [{ label: 'GitHub', href: 'https://github.com/ACaccel' }],
  email: 'acaccel8763@gmail.com',
};
