#!/usr/bin/env bash
# Build as the invoking user, then install the release and Nginx routing as root.
set -Eeuo pipefail

repo_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
web_root=/var/www/ac-site
backup_root=/var/backups/ac-site
site_url=https://acserver.csie.org
keep_releases=5

if [[ $EUID -ne 0 ]]; then
  cd "$repo_dir"
  # Every release must correspond to a commit so the live site can be traced and rebuilt.
  if [[ -n $(git status --porcelain) ]]; then
    echo 'Commit or stash local changes before deploying.' >&2
    exit 1
  fi
  export PATH="$repo_dir/.conda/bin:$PATH"
  npm run check
  release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short=12 HEAD)"
  exec sudo bash "$repo_dir/deploy/deploy.sh" --install "$release"
fi

[[ ${1:-} == --install && ${2:-} =~ ^[0-9]{8}T[0-9]{6}Z-[0-9a-f]{12,40}$ ]] || {
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

site_file=$(readlink -f /etc/nginx/sites-enabled/acserver.csie.org)
test -f "$site_file"
systemctl is-active --quiet nginx
nginx -t -q

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

nginx_changed=false
rollback() {
  echo 'Deployment failed; restoring the previous state.' >&2
  if [[ -n $previous_release ]]; then
    ln -sfn "$previous_release" "$web_root/current.new"
    mv -Tf "$web_root/current.new" "$web_root/current"
  else
    rm -f -- "$web_root/current"
  fi
  if [[ $nginx_changed == true ]]; then
    cp -p "$backup_dir/site.conf" "$site_file"
    for name in "${!snippets[@]}"; do
      if [[ -f $backup_dir/$name ]]; then
        cp -p "$backup_dir/$name" "${snippets[$name]}"
      else
        rm -f -- "${snippets[$name]}"
      fi
    done
    if nginx -t -q; then systemctl reload nginx || true; fi
  fi
  echo "Backup kept in $backup_dir" >&2
}
trap rollback ERR

release_dir="$web_root/releases/$release"
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
    install -m 0644 "$repo_dir/deploy/nginx/$name" "${snippets[$name]}"
  done
  # Write in place to keep the owner, mode, and symlink target of the site file.
  cat "$backup_dir/site.new.conf" > "$site_file"
  nginx -t -q
  systemctl reload nginx
  sleep 1
fi

status() { curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$1"; }
[[ $(status "$site_url/") == 200 ]]
[[ $(status "$site_url/en/") == 200 ]]
[[ $(status "$site_url/ac-site-deploy-check-$release/") == 404 ]]
[[ $(status "http://acserver.csie.org/") == 308 ]]
trap - ERR

# Keep the newest releases; the current one is always among them.
find "$web_root/releases" -mindepth 1 -maxdepth 1 -type d -name '*Z-*' -printf '%f\n' \
  | sort | head -n "-$keep_releases" \
  | while IFS= read -r stale; do
      [[ releases/$stale == "$(readlink "$web_root/current")" ]] || rm -rf -- "${web_root:?}/releases/$stale"
    done
find "$backup_root" -mindepth 1 -maxdepth 1 -type d -name 'deploy-*' -printf '%f\n' \
  | sort | head -n "-$keep_releases" \
  | while IFS= read -r stale; do rm -rf -- "${backup_root:?}/$stale"; done

echo "Deployed $release (Nginx reloaded: $needs_reload). Backup: $backup_dir"
