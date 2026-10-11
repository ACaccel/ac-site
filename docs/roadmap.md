# Personal website roadmap

Status: proposed directions, not implementation commitments. Reviewed on 2026-10-11
against the repository at `61167f2` and its locally built homepage at desktop and mobile widths.
This is a content and design assessment, not a production availability, accessibility, or
performance audit. Project constraints and operational instructions remain authoritative in
[AGENTS.md](../AGENTS.md).

## Current assessment

The site already provides a useful foundation: equivalent Chinese and English homepages,
a short introduction, two public service links, a GitHub profile link, system-based light and
dark colors, and a static build with deployment and rollback tooling. The restrained typography,
teal accent, narrow reading column, and outlined service cards work well for a small directory.

The main opportunity is to explain the person behind the services. A first-time visitor can
find Card Together and LARP Platform, but cannot learn the owner's specific contribution,
engineering decisions, or interests beyond the introductory sentence. Hosting a service does
not establish authorship; future project descriptions should state the verified role explicitly.
There are currently no project case studies, articles, screenshots, public contact address,
or social sharing metadata. The homepage also repeats the name in the header and main heading
without adding a more distinctive introduction.

Recommended default: grow into a compact personal portfolio with a useful service directory.
Keep the homepage short and put detailed stories on separate pages. This recommendation assumes
the audience includes peers and potential collaborators; recruitment, research, or community
building could change the priorities below.

## Potential content

Effort is relative: **small** means one focused content or layout change; **medium** means a
new content type and bilingual pages; **large** means ongoing publishing or operational work.
Translation, asset preparation, and permission to publish can dominate implementation effort.

| Direction                          | Visitor value and smallest useful version                                                                                                                       | Effort / maintenance                     | Priority        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| Selected projects and case studies | Two verified examples with the problem, personal role, approach, outcome, and links. Distinguish implementation, collaboration, and hosting.                    | Medium / update when a project changes   | P1              |
| More personal introduction         | A short statement of current interests and the kinds of collaboration welcomed. Link to projects and GitHub; publish a contact method only after choosing it.   | Small / occasional review                | P1              |
| Clearer service discovery          | Keep the existing directory; make “Open service” and “Source” actions explicit, and explain who each service is for. Add sanitized preview images where useful. | Small to medium / review links           | P1              |
| Technical notes                    | Start with two complete articles about a public project decision or a general engineering lesson. Include dates and equivalent translations.                    | Medium / high editorial commitment       | P2              |
| About and experience               | A short narrative, selected experience, and public achievements. Add a résumé only if professional discovery becomes a goal.                                    | Medium / periodic review                 | P2, conditional |
| Now page                           | A dated snapshot of current learning or work, without private details. Useful only if it can be refreshed regularly.                                            | Small / frequent editorial review        | P3              |
| Small interactive demonstrations   | One self-contained game mechanic, algorithm visualization, or tool related to an actual project, with an accessible text explanation.                           | Medium to large / browser and CSP checks | P3, conditional |
| Public service status              | Link to an existing public status page first. Build an integration only if service users need it and monitoring already exists.                                 | Large / ongoing operations               | P3, conditional |
| Uses, reading notes, or interests  | A curated page that adds personality and explains choices, rather than a long list of products or links.                                                        | Small / periodic review                  | P3              |

### First project case study

Use a repeatable structure: a one-paragraph problem statement, the owner's contribution,
one or two difficult decisions, a sanitized screenshot or diagram, and what was learned.
Include a live link and a repository link when public. Quantitative results should have evidence;
a clear qualitative outcome is preferable to invented adoption or performance numbers.

Card Together or LARP Platform could provide material, but the owner's role and publishable
assets must be confirmed before drafting claims. Other public work can be selected instead.
Use synthetic accounts in screenshots and retain collaborator attribution. Choose projects for
the story they tell, not just because they happen to run on this host.

### Publishing model

Use build-time content collections for project descriptions and, later, Markdown articles.
[Astro content collections](https://docs.astro.build/en/guides/content-collections/) provide
schema validation and build-time content access. Keep portfolio content separate from the
existing service directory so adding a public service remains a data-only operation.

Launch an article section only when its first complete bilingual entries are ready. Add RSS
with the first publication batch; add tags and search when the amount of content makes browsing
difficult. A CMS is a later option if editing Markdown becomes a demonstrated obstacle.

## Design directions

| Option                                    | What it would look like                                                                                                                 | Benefit and trade-off                                                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Refined editorial portfolio — recommended | Keep the neutral palette and teal accent; add a stronger introductory statement, selected work with previews, and clear section rhythm. | Fits the current site and scales to articles with modest CSS and asset work.                 |
| Visual project gallery                    | Larger screenshots, a wider project grid, and more prominent project actions. Keep article text in a narrow column.                     | Stronger visual evidence, but requires consistently good images and more mobile layout work. |
| Developer notebook                        | Text-led homepage with recent notes, project summaries, and small technical diagrams.                                                   | Suits regular writing; depends on a sustainable publishing habit.                            |

The existing content and assumed audience support the editorial option most strongly. Adopt the gallery
if polished visual projects become the main attraction, or the notebook if writing becomes the
main reason to return. These are proposals, not a reason to redesign before gathering content.

### Concrete improvements

- **Introduction:** retain the name in the header, then use the main heading and short lead to
  communicate interests and purpose. Avoid oversized hero graphics that push useful links away.
- **Homepage hierarchy:** introduce the owner, show two selected projects, retain the public
  services, and finish with profile/contact links. Add recent notes only after articles exist.
  Keep service access easy to find for returning users.
- **Project previews:** use local, optimized images with fixed dimensions and meaningful alt
  text. Show role and outcome alongside the image. Services and case studies should have
  distinct actions so visitors understand whether they are launching a tool or reading about it.
- **Layout and navigation:** keep the reading width for prose; consider two project columns on
  wide screens and one on mobile. Add a small navigation bar when there are separate sections,
  with a visible current-page state and a skip link. Account for longer English text.
- **Visual identity:** extend the existing AC favicon and teal palette into consistent spacing,
  headings, borders, and buttons. A monogram, small illustration, or chosen avatar can add
  personality; a portrait and custom font are optional, not prerequisites.
- **Accessibility:** validate light and dark contrast, keyboard focus, headings, image
  alternatives, touch targets, text zoom, and narrow-screen reflow against
  [WCAG 2.2 guidance](https://www.w3.org/WAI/WCAG22/quickref/). The existing focus styles are a
  useful starting point; browser previews alone do not establish conformance.
- **Motion and themes:** use subtle CSS feedback where it clarifies an action and respect
  reduced-motion preferences. Keep system-based themes initially; a manual toggle is worthwhile
  only if users need it and its script can meet the production security policy.

## Development sequence

### P1 — Establish identity and show evidence

1. Confirm the primary audience and select two public projects with verified contribution and
   publishable assets. Choose the editorial visual direction unless the content suggests otherwise.
2. Improve the introduction and service actions; add selected-project previews using approved
   content. Create paired project detail pages and lightweight navigation.
3. Add page-specific titles and descriptions, local social preview images, and a sitemap. Titles
   should clearly describe each page; see Google's
   [title link guidance](https://developers.google.com/search/docs/appearance/title-link).
   Add social metadata as a separate sharing improvement, without promising ranking gains.
4. Validate desktop and mobile layouts, both languages, keyboard access, and production routing.

Completion: a visitor can understand the owner's interests, inspect two concrete contributions,
and reach the existing services. Every new page has its own correct metadata and language pair.
No public contact details are added without the owner's choice.

### P2 — Build a reusable publishing foundation

1. Publish two complete technical notes using validated content and a shared article layout.
2. Add a notes index, RSS, and a small recent-notes section on the homepage.
3. Add an About page or a public résumé if the chosen audience needs more background.
4. Add CI for the existing check command and targeted coverage for new routing, translation,
   metadata, and content-validation behavior. Review links and outdated content periodically.

Completion: publishing a new bilingual article requires content and assets rather than copied
page markup. Reader navigation and project/service links remain usable without JavaScript.

### P3 — Expand only when there is demand

Choose one direction based on actual use: richer project visuals, more writing, an interactive
demo, or a public status link. Search is justified by a growing archive; status integration is
justified by service-support needs. Review whether new dependencies and recurring work improve
the experience enough to sustain them. There is no calendar commitment for these phases.

## Technical dependencies to resolve during implementation

- **Page URLs:** `BaseLayout.astro` currently generates canonical and alternate links for locale
  roots, which works for the current homepage. Before adding detail pages, derive those links
  from each page and its translated counterpart. Likewise, preserve the current page when
  switching languages; keep the shared bilingual 404 behavior and its `noindex` metadata.
- **Route ownership:** reserve proposed sections such as `/projects/`, `/notes/`, and `/about/`
  before publishing them. Check the shared host's existing service routes and expand the
  service-path validation accordingly. Site pages must not shadow public service prefixes.
- **Security policy:** the repository's Nginx CSP denies scripts and external fonts by
  default. Static pages and CSS improvements fit it; an interactive feature needs an explicit,
  minimal policy change and verification. Syntax highlighting, embeds, and generated markup
  must also be checked for inline scripts or styles. Follow the project rules rather than
  assuming development-server behavior represents production.
- **Status semantics:** a successful build or homepage request does not prove service health.
  A future status display needs an independent check, a last-checked timestamp, an unknown/stale
  state, and a failure policy. A static build-time snapshot must never imply live monitoring.
- **Performance:** keep images local and sized for their display, defer below-the-fold media,
  and retain static rendering. Measure the current build before setting an asset or performance
  budget; no speed score or production latency was measured for this roadmap.
- **Validation:** keep the existing check command as the baseline. New features need relevant
  checks for language equivalence, reserved paths, metadata, and generated HTML, plus browser
  checks for layouts and keyboard interaction. Any new test infrastructure needs agreement.

## Lower-priority features and decision gates

Comments, accounts, a contact-form backend, live GitHub widgets, and third-party analytics bring
moderation, privacy, integration, or operational costs without a demonstrated current need.
Prefer profile links, static summaries, and a deliberately chosen contact link initially.
Analytics can be evaluated if there is a concrete measurement question; traffic collection is
not a prerequisite for publishing useful work.

Before implementing a phase, decide its audience, available bilingual content, visual direction,
public contact preference, and sustainable update cadence. These decisions affect the result;
routine component and CSS choices can follow the existing project conventions.

The highest-value next increment is two credible project stories with a clearer introduction
and improved sharing metadata. It adds substance and identity while preserving the site's
simple operation and useful service links.
