# ac-site project instructions

This is the authoritative project rule set. `CLAUDE.md` references it.

## Stack

Static personal website for `https://acserver.csie.org/`, built with Astro and TypeScript and
served directly by the host's Nginx. Node 24 LTS comes from the project-local conda environment
in `.conda/`; do not rely on the system Node.

## Setup and validation

```sh
CONDA_EXE=~/miniforge3/bin/conda scripts/setup-env.sh   # create .conda and run npm ci
export PATH="$PWD/.conda/bin:$PATH"
npm run dev            # local dev server
npm run check          # format check, lint, type check, deploy tests, build
npm run format         # apply Prettier
```

## Deployment

Run from a clean, committed working tree as the deployment user (sudo password required):

```sh
bash deploy/deploy.sh      # check and build, then install a release as root
bash deploy/rollback.sh    # point the live site at the previous release
```

`deploy.sh` holds the host-wide `/run/lock/acserver-nginx-deploy.lock`, copies `dist/` to
`/var/www/ac-site/releases/<UTC time>-<commit>/`, and switches the `current` symlink. When the
snippets in `deploy/nginx/` or the site-file routing differ from the installed state, it installs
them, replaces the placeholder `location / { return 404; }` in both server blocks of
`/etc/nginx/sites-enabled/acserver.csie.org` with `# ac-site managed route` blocks, and reloads
Nginx only after `nginx -t` passes. Any failure, including the public health checks, restores
the previous release, site file, and snippets. Backups and the newest five releases are kept
under `/var/backups/ac-site/` and `/var/www/ac-site/releases/`.

To take the site off the domain root, write a candidate with
`python3 deploy/configure-nginx.py --action remove --input <site file> --output <candidate>`,
review it, and install it as root followed by `nginx -t` and a reload.

## Layout

- `src/pages/`: routes. Traditional Chinese at `/`, English under `/en/`, shared `404.html`.
- `src/components/`, `src/layouts/`: page sections and the shared page shell.
- `src/content/services.json`: public services shown on the homepage; schema in
  `src/content.config.ts`.
- `src/i18n/ui.ts`: interface strings for both languages.
- `src/data/profile.ts`: name and profile links.
- `deploy/`: Nginx snippets, site-file editor and its tests, deploy and rollback scripts.
- `environment.yml`, `scripts/setup-env.sh`: toolchain environment.

## Rules

- Every page exists in both languages with equivalent content.
- The repository is public: list only public services, and commit no private service names,
  paths, internal ports, or personal data beyond what the site already publishes.
- Adding a service is a data-only change to `services.json`; paths are single segments such as
  `/name/` and must not use the site's own `/en/` or `/_astro/`.
- Keep pages free of inline scripts and inline styles so the CSP needs no `'unsafe-inline'`.
- Output must stay fully static; the site runs no server process.
- Never edit other projects' managed blocks in the shared Nginx site file.
