# Deployment

The built site is copied into a release directory that the host's Nginx serves directly. No
server process runs.

## Requirements

- Clean, committed working tree: every release is named after and traceable to a commit.
- Project toolchain installed; see [AGENTS.md](../AGENTS.md#setup-and-validation).
- Deployment user with sudo; the host has `python3`, `rsync`, `nginx`, `systemctl`, `flock`, and
  `curl`, and Nginx is running.
- The site file `/etc/nginx/sites-enabled/acserver.csie.org` has exactly one HTTP and one HTTPS
  server block for the host, each with an explicit IPv4 `listen` address. Each block has no root
  location other than one placeholder `location / { return 404; }` or one
  `# ac-site managed route` block.

## Deploy

```sh
bash deploy/deploy.sh
```

1. As the invoking user: refuses a dirty tree, runs `npm run check`, then reruns itself through
   `sudo`.
2. Takes `/run/lock/ac-site-deploy.lock` and the host-wide
   `/run/lock/acserver-nginx-deploy.lock` (waits up to 60 s for other projects).
3. Backs up the site file and snippets, copies `dist/` to `releases/<UTC time>-<commit>/`, and
   switches the `current` symlink.
4. Only when `deploy/nginx/` or the site-file routing differs from the installed state: installs
   the snippets, replaces the placeholder in both server blocks with managed include blocks, runs
   `nginx -t`, and reloads Nginx.
5. Health checks the local listeners, independent of public DNS:

   | Request              | Expected |
   | -------------------- | -------- |
   | `https://<host>/`    | 200      |
   | `https://<host>/en/` | 200      |
   | Unknown HTTPS path   | 404      |
   | `http://<host>/`     | 308      |

6. Keeps the newest five releases and the newest five backups.

On any failure, including a failed health check or an interrupt, the script restores the previous
release, site file, and snippets, and reloads Nginx if it changed them. It prints the backup
directory and lists any item that needs manual repair.

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

| Path                                    | Contents                                  |
| --------------------------------------- | ----------------------------------------- |
| `/var/www/ac-site/current`              | Symlink to the live release               |
| `/var/www/ac-site/releases/`            | Release directories                       |
| `/var/backups/ac-site/deploy-*/`        | Site file and snippet backups per deploy  |
| `/etc/nginx/snippets/ac-site.conf`      | HTTPS routes, cache, and security headers |
| `/etc/nginx/snippets/ac-site-http.conf` | HTTP to HTTPS redirect                    |
