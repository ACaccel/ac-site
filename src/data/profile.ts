export interface ProfileLink {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  links: ProfileLink[];
  /** Shown as a mailto link when set; left out until the owner chooses an address. */
  email?: string;
}

export const profile: Profile = {
  name: 'ACaccel',
  links: [{ label: 'GitHub', href: 'https://github.com/ACaccel' }],
};
