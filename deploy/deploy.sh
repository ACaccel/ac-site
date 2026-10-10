#!/usr/bin/env bash
# Build as the invoking user, then install the release and Nginx routing as root.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
web_root=/var/www/ac-site
backup_root=/var/backups/ac-site
host=acserver.csie.org
keep_releases=5
release_pattern='[0-9]{8}T[0-9]{6}Z-[0-9a-f]{12,40}'

if [[ $EUID -ne 0 ]]; then
  cd "$repo_dir"
  # Every release must correspond to a commit so the live site can be traced and rebuilt.
  changes=$(git status --porcelain)
  if [[ -n $changes ]]; then
    echo 'Commit or stash local changes before deploying.' >&2
    exit 1
  fi
  export PATH="$repo_dir/.conda/bin:$PATH"
  npm run check
  release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short=12 HEAD)"
  exec sudo bash "$repo_dir/deploy/deploy.sh" --install "$release"
fi

[[ ${1:-} == --install && ${2:-} =~ ^${release_pattern}$ ]] || {
  echo 'Run deploy/deploy.sh as the deployment user, not directly as root.' >&2
  exit 2
}
release=$2
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
for tool in python3 rsync nginx systemctl flock curl; do command -v "$tool" >/dev/null; done
test -f "$repo_dir/dist/index.html"
test -f "$repo_dir/dist/404.html"

exec 9>/run/lock/ac-site-deploy.lock
flock -n 9 || { echo 'Another ac-site deployment is running.' >&2; exit 1; }
exec 8>/run/lock/acserver-nginx-deploy.lock
flock -w 60 8 || { echo 'Another shared Nginx deployment is running.' >&2; exit 1; }

site_file=$(readlink -f "/etc/nginx/sites-enabled/$host")
test -f "$site_file"
systemctl is-active --quiet nginx
nginx -t -q
# Check the local listeners directly so the result does not depend on public DNS or NAT.
https_address=$(grep -Po '^\s*listen\s+\K[0-9.]+(?=:443\s+ssl\s*;)' "$site_file" | head -n 1 || true)
http_address=$(grep -Po '^\s*listen\s+\K[0-9.]+(?=:80\s*;)' "$site_file" | head -n 1 || true)
[[ -n $https_address && -n $http_address ]] || {
  echo "Cannot find the explicit IPv4 listeners for $host." >&2
  exit 1
}

install -d -m 0755 "$web_root" "$web_root/releases"
install -d -m 0700 "$backup_root"
backup_dir=$(mktemp -d "$backup_root/deploy-$release-XXXXXX")
cp -p "$site_file" "$backup_dir/site.conf"
declare -A snippets=(
  [ac-site.conf]=/etc/nginx/snippets/ac-site.conf
  [ac-site-http.conf]=/etc/nginx/snippets/ac-site-http.conf
)
for name in "${!snippets[@]}"; do
  if [[ -f ${snippets[$name]} ]]; then cp -p "${snippets[$name]}" "$backup_dir/$name"; fi
done
previous_release=$(readlink "$web_root/current" || true)
python3 -B "$repo_dir/deploy/configure-nginx.py" \
  --input "$site_file" --output "$backup_dir/site.new.conf"

release_dir="$web_root/releases/$release"
nginx_changed=false

# Replace a file atomically, keeping the owner and mode of the file it replaces.
replace_file() {
  local source=$1 target=$2 temp
  temp=$(mktemp "$(dirname -- "$target")/.ac-site-XXXXXX")
  cp -- "$source" "$temp"
  if [[ -e $target ]]; then
    chown --reference="$target" "$temp"
    chmod --reference="$target" "$temp"
  else
    chmod 0644 "$temp"
  fi
  mv -f -- "$temp" "$target"
}

# Best effort: run every step even if one fails, then report the failures.
rollback() {
  trap - ERR INT HUP TERM
  set +e
  local failed=()
  echo 'Deployment failed; restoring the previous state.' >&2
  if [[ -n $previous_release ]]; then
    ln -sfn "$previous_release" "$web_root/current.new" &&
      mv -Tf "$web_root/current.new" "$web_root/current" || failed+=('release symlink')
  else
    rm -f -- "$web_root/current" || failed+=('release symlink')
  fi
  if [[ $(readlink "$web_root/current") != "releases/$release" ]]; then
    rm -rf -- "$release_dir" "$release_dir.partial"
  fi
  if [[ $nginx_changed == true ]]; then
    replace_file "$backup_dir/site.conf" "$site_file" || failed+=("$site_file")
    for name in "${!snippets[@]}"; do
      if [[ -f $backup_dir/$name ]]; then
        replace_file "$backup_dir/$name" "${snippets[$name]}" || failed+=("${snippets[$name]}")
      else
        rm -f -- "${snippets[$name]}" || failed+=("${snippets[$name]}")
      fi
    done
    if nginx -t -q; then
      systemctl reload nginx || failed+=('nginx reload')
    else
      failed+=('nginx -t after restore')
    fi
  fi
  echo "Backup kept in $backup_dir" >&2
  if ((${#failed[@]})); then
    printf 'Manual repair needed for: %s\n' "${failed[@]}" >&2
  fi
}
trap 'code=$?; rollback; exit "$code"' ERR
trap 'rollback; exit 130' INT HUP TERM

test ! -e "$release_dir"
rsync -a --delete --chown=root:root --chmod=D755,F644 "$repo_dir/dist/" "$release_dir.partial/"
mv -T "$release_dir.partial" "$release_dir"
ln -sfn "releases/$release" "$web_root/current.new"
mv -Tf "$web_root/current.new" "$web_root/current"

needs_reload=false
for name in "${!snippets[@]}"; do
  if ! cmp -s "$repo_dir/deploy/nginx/$name" "${snippets[$name]}"; then needs_reload=true; fi
done
if ! cmp -s "$backup_dir/site.new.conf" "$site_file"; then needs_reload=true; fi
if [[ $needs_reload == true ]]; then
  nginx_changed=true
  install -d -m 0755 /etc/nginx/snippets
  for name in "${!snippets[@]}"; do
    replace_file "$repo_dir/deploy/nginx/$name" "${snippets[$name]}"
  done
  # The temporary file sits next to the resolved target, outside sites-enabled.
  replace_file "$backup_dir/site.new.conf" "$site_file"
  nginx -t -q
  systemctl reload nginx
fi

# Retry briefly so a reload that is still spawning workers does not fail the deploy.
expect_status() {
  local expected=$1 url=$2 port=$3 address=$4 attempt actual
  for attempt in 1 2 3 4 5; do
    actual=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 5 \
      --resolve "$host:$port:$address" "$url" || true)
    [[ $actual == "$expected" ]] && return 0
    sleep 1
  done
  echo "Health check failed: $url returned $actual, expected $expected." >&2
  return 1
}
expect_status 200 "https://$host/" 443 "$https_address"
expect_status 200 "https://$host/en/" 443 "$https_address"
expect_status 404 "https://$host/ac-site-deploy-check-$release/" 443 "$https_address"
expect_status 308 "http://$host/" 80 "$http_address"
trap - ERR INT HUP TERM

# Keep the newest releases; the current one is always among them.
find "$web_root/releases" -mindepth 1 -maxdepth 1 -type d \
  -regextype posix-extended -regex ".*/${release_pattern}" -printf '%f\n' \
  | sort | head -n "-$keep_releases" \
  | while IFS= read -r stale; do
      [[ releases/$stale == "$(readlink "$web_root/current")" ]] || rm -rf -- "${web_root:?}/releases/$stale"
    done
find "$backup_root" -mindepth 1 -maxdepth 1 -type d -name 'deploy-*' -printf '%f\n' \
  | sort | head -n "-$keep_releases" \
  | while IFS= read -r stale; do rm -rf -- "${backup_root:?}/$stale"; done

echo "Deployed $release (Nginx reloaded: $needs_reload). Backup: $backup_dir"
