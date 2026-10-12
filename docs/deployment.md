# Deployment

The built site is copied into a release directory that the host's Nginx serves directly. No
server process runs.

## Requirements

- Uncommitted changes are allowed; their release name ends in `-dirty`, so the live site cannot
  be rebuilt from the commit alone. Commit first when the release must be traceable.
- Project toolchain installed; see [AGENTS.md](../AGENTS.md#setup-and-validation).
- Deployment user with sudo; the host has `python3`, `rsync`, `nginx`, `systemctl`, `flock`, and
  `curl`, and Nginx is running.
- The site file `/etc/nginx/sites-enabled/acserver.csie.org` has exactly one HTTP and one HTTPS
  server block for the host, each with an explicit IPv4 `listen` address. Each block has no root
  location other than one placeholder `location / { return 404; }` or one
  `# acaccel-site managed route` block.

## Deploy

```sh
bash deploy/deploy.sh
```

1. As the invoking user: warns about uncommitted changes, runs `npm run check`, then reruns
   itself through `sudo`.
2. Takes `/run/lock/acaccel-site-deploy.lock` and the host-wide
   `/run/lock/acserver-nginx-deploy.lock` (waits up to 60 s for other projects).
3. Backs up the site file and snippets, copies `dist/` to
   `releases/<UTC time>-<commit>[-dirty]/`, and switches the `current` symlink.
4. Only when `deploy/nginx/` or the site-file routing differs from the installed state: installs
   the snippets, replaces the placeholder in both server blocks with managed include blocks, runs
   `nginx -t`, and reloads Nginx.
5. Health checks the local listeners, independent of public DNS:

   | Request              | Expected |
   | -------------------- | -------- |
   | `https://<host>/`    | 200      |
   | `https://<host>/en/` | 301      |
   | Unknown HTTPS path   | 404      |
   | `http://<host>/`     | 308      |

6. Keeps the newest five releases and the newest five backups.

On any failure, including a failed health check or an interrupt, the script restores the previous
release, site file, and snippets, and reloads Nginx if it changed them. It prints the backup
directory and lists any item that needs manual repair.

### Migration from the former name

The project was renamed from `ac-site`. The first deploy under the new name copies
`/var/www/ac-site` and moves `/var/backups/ac-site` to the new paths, rewrites the
`# ac-site managed route` blocks, and, after the health checks pass, deletes the old web root and
snippets. Copies of the old snippets stay in that deploy's backup directory.

## Roll back

```sh
bash deploy/rollback.sh
```

Points `current` at the release immediately before it. Nginx configuration is not changed; to
revert it, restore the files from the backup directory, then run `nginx -t` and reload.

## Remove the site from the domain root

1. Write a candidate: `python3 deploy/configure-nginx.py --action remove --input <site file> --output <candidate>`.
2. Review the diff against the site file.
3. As root, install the candidate, run `nginx -t`, and reload Nginx.

The candidate restores the placeholder route and leaves other projects' blocks byte-for-byte
intact.

## Host paths

| Path                                         | Contents                                  |
| -------------------------------------------- | ----------------------------------------- |
| `/var/www/acaccel-site/current`              | Symlink to the live release               |
| `/var/www/acaccel-site/releases/`            | Release directories                       |
| `/var/backups/acaccel-site/deploy-*/`        | Site file and snippet backups per deploy  |
| `/etc/nginx/snippets/acaccel-site.conf`      | HTTPS routes, cache, and security headers |
| `/etc/nginx/snippets/acaccel-site-http.conf` | HTTP to HTTPS redirect                    |
