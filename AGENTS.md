# ac-site project instructions

Authoritative project rule set; `CLAUDE.md` points here.

## Stack

- Static personal website for `https://acserver.csie.org/`, served directly by the host's Nginx.
- Astro and TypeScript; Prettier, ESLint, and `astro check`.
- Node 24 LTS from the project-local conda environment in `.conda/`; do not use the system Node.

## Setup and validation

```sh
CONDA_EXE=~/miniforge3/bin/conda scripts/setup-env.sh   # create .conda and run npm ci
export PATH="$PWD/.conda/bin:$PATH"
npm run dev      # local dev server
npm run format   # apply Prettier
npm run check    # format check, lint, type check, deploy tests, build
```

Deployment and rollback: [docs/deployment.md](docs/deployment.md).

## Layout

| Path                                      | Purpose                                                    |
| ----------------------------------------- | ---------------------------------------------------------- |
| `src/pages/`                              | Routes: English home at `/`, `404`                         |
| `src/components/`, `src/layouts/`         | Page sections and the shared page shell                    |
| `src/content/services.json`               | Public services on the homepage                            |
| `src/content.config.ts`                   | Service schema                                             |
| `src/data/services.ts`                    | Service loading, path conflict check, sorting              |
| `src/data/profile.ts`                     | Name and profile links                                     |
| `deploy/`                                 | Nginx snippets, site-file editor and tests, deploy scripts |
| `environment.yml`, `scripts/setup-env.sh` | Toolchain environment                                      |
| `docs/roadmap.md`                         | Proposed content and design directions                     |

## Rules

- Content is English-only; the old `/en/` path redirects to `/` in Nginx.
- The repository is public: list only public services, and commit no private service names,
  paths, internal ports, or personal data beyond what the site already publishes.
- Adding a service is a data-only change to `services.json`. Paths are single segments such as
  `/name/` and must not be `/en/` or `/_astro/`.
- UI uses Material UI components and design; hand-build only what it cannot cover, in the same
  style.
- Material UI injects runtime styles, so the CSP may allow `'unsafe-inline'` in `style-src`.
  Scripts stay strict: no hand-written inline scripts and no `'unsafe-inline'` in `script-src`;
  allow framework-generated inline scripts by hash.
- Output stays fully static; the site runs no server process.
- Never edit other projects' managed blocks in the shared Nginx site file.
