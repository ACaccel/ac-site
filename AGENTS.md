# ac-site project instructions

This is the authoritative project rule set. `CLAUDE.md` references it.

## Stack

Static personal website for `https://acserver.csie.org/`, built with Astro and TypeScript.
Node 24 LTS comes from the project-local conda environment in `.conda/`; do not rely on the
system Node.

## Setup and validation

```sh
CONDA_EXE=~/miniforge3/bin/conda scripts/setup-env.sh   # create .conda and run npm ci
export PATH="$PWD/.conda/bin:$PATH"
npm run dev            # local dev server
npm run check          # format check, lint, type check, build
npm run format         # apply Prettier
```

## Layout

- `src/pages/`: routes. Traditional Chinese at `/`, English under `/en/`.
- `src/layouts/`: shared page shells.
- `environment.yml`, `scripts/setup-env.sh`: toolchain environment.

## Rules

- Every page exists in both languages with equivalent content.
- The repository is public: list only public services, and commit no private service names,
  paths, internal ports, or personal data beyond what the site already publishes.
- Keep pages free of inline scripts and inline styles so the CSP needs no `'unsafe-inline'`.
- Output must stay fully static; the site runs no server process.
