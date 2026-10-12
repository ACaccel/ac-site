# Writing content

Site text lives in Markdown files under `src/content/`; editing them needs no code changes.

| File                           | Shown as                                                      |
| ------------------------------ | ------------------------------------------------------------- |
| `src/content/posts/<id>.md`    | Post at `/posts/<id>/`, listed newest first                   |
| `src/content/now.md`           | Now page at `/now/` and the homepage card                     |
| `src/content/about.md`         | Introduction on `/about/`                                     |
| `src/content/experience.yaml`  | Experience summary on `/about/` (hidden while empty)          |
| `src/content/services.json`    | Services on `/services/` and the homepage                     |
| `src/content/projects/<id>.md` | Project at `/projects/<id>/`; `featured` ones on the homepage |
| `src/data/profile.ts`          | Name, tagline, profile links, contact email                   |

## Posts

The file name becomes the URL, so use lowercase words joined by hyphens, such as
`nginx-routing.md`. [`example-post.md`](../src/content/posts/example-post.md) is a draft
template.

Front matter fields:

| Field         | Required | Notes                                                                    |
| ------------- | -------- | ------------------------------------------------------------------------ |
| `title`       | Yes      | Page title and list entry                                                |
| `description` | Yes      | One-line summary for the list and search engines                         |
| `date`        | Yes      | Publication date, `YYYY-MM-DD`                                           |
| `updated`     | No       | Last significant revision, `YYYY-MM-DD`                                  |
| `tags`        | No       | Lowercase slugs such as `[nginx, games]`; each gets `/posts/tags/<tag>/` |
| `draft`       | No       | `true` hides the post from the deployed site; default `false`            |

The build fails on a missing or misspelled field, so a broken post never goes live. Code blocks
get syntax highlighting when they name a language, such as ` ```ts `.

Posts with two or more `##`/`###` headings get a table of contents on wide screens. Published
posts also appear in the RSS feed at `/rss.xml`.

## Now

`now.md` front matter: `summary` (one or two sentences for the homepage card), `updated`
(`YYYY-MM-DD`), and `draft`. While `draft: true`, the page, the homepage card, and the footer
link stay out of the deployed site.

## Services

Each key in `services.json` maps to `name`, `path` (`/name/`), `description`, and optional
`source` (HTTPS URL), `status` (`active` default, `beta`, or `archived`; archived services lose
the open button and leave the homepage), and `stack` (technology names).

## Projects

[`example-project.md`](../src/content/projects/example-project.md) is a draft template with the
suggested sections. Front matter: `title`, `summary`, `role` (such as 開發, 協作, 代管), `start`
and optional `end` (`YYYY-MM`), and optional `stack`, `links` (`label` and HTTPS `href`),
`service` (a key in `services.json`, adds an open button), `featured` (show on the homepage),
and `draft`.

## Experience

Each entry in `experience.yaml` has a unique `id`, `title`, `organization`, `start` (`YYYY-MM`),
an optional `end` (omit while ongoing), and an optional one-sentence `description`. Entries are
listed newest first. The file's header comment shows an example.

## Preview and publish

1. Run `npm run dev` and open the printed address; drafts are visible there. With VS Code Remote
   SSH, the port is forwarded automatically.
2. Commit the change and deploy as described in [deployment.md](deployment.md).
