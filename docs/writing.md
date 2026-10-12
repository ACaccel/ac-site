# Writing content

Site text lives in Markdown files under `src/content/`; editing them needs no code changes.

| File                        | Shown as                                    |
| --------------------------- | ------------------------------------------- |
| `src/content/about.md`      | Introduction on the homepage                |
| `src/content/posts/<id>.md` | Post at `/posts/<id>/`, listed newest first |
| `src/content/services.json` | Services on the homepage                    |
| `src/data/profile.ts`       | Name, profile links, and contact email      |

## Posts

The file name becomes the URL, so use lowercase words joined by hyphens, such as
`nginx-routing.md`. [`example-post.md`](../src/content/posts/example-post.md) is a draft
template.

Front matter fields:

| Field         | Required | Notes                                                         |
| ------------- | -------- | ------------------------------------------------------------- |
| `title`       | Yes      | Page title and list entry                                     |
| `description` | Yes      | One-line summary for the list and search engines              |
| `date`        | Yes      | Publication date, `YYYY-MM-DD`                                |
| `updated`     | No       | Last significant revision, `YYYY-MM-DD`                       |
| `draft`       | No       | `true` hides the post from the deployed site; default `false` |

The build fails on a missing or misspelled field, so a broken post never goes live. Code blocks
get syntax highlighting when they name a language, such as ` ```ts `.

## Preview and publish

1. Run `npm run dev` and open the printed address; drafts are visible there. With VS Code Remote
   SSH, the port is forwarded automatically.
2. Commit the change and deploy as described in [deployment.md](deployment.md).
