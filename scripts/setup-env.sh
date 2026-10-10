#!/usr/bin/env bash
set -euo pipefail
project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
project_prefix="$project_root/.conda"
conda_command="${CONDA_EXE:-$(command -v conda || true)}"
if [[ -z "$conda_command" || ! -x "$conda_command" ]]; then
  echo 'Conda is required. Activate your conda shell or set CONDA_EXE to its executable, then retry.' >&2
  exit 1
fi
if [[ -d "$project_prefix/conda-meta" ]]; then
  "$conda_command" env update --prefix "$project_prefix" --file "$project_root/environment.yml" --prune
else
  "$conda_command" env create --prefix "$project_prefix" --file "$project_root/environment.yml" --yes
fi
export PATH="$project_prefix/bin:$PATH"
cd "$project_root"
# Pin npm to package.json's packageManager so lockfiles stay consistent.
npm_package="$(node -p 'JSON.parse(require("node:fs").readFileSync("package.json", "utf8")).packageManager')"
if [[ "$(npm --version)" != "${npm_package#npm@}" ]]; then
  npm install --global --prefix "$project_prefix" "$npm_package" --no-audit --no-fund
fi
npm ci
