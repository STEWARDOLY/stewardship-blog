# Stewardship Journeys

Jekyll site for stewardshipjourneys.com, built to run on GitHub Pages with no
plugins beyond the GitHub Pages defaults and no build tooling.

## Where the content lives

Nothing on the homepage is hard-coded in a template. Every string comes from
one of two places:

| Homepage section | Source |
| --- | --- |
| Masthead brand + tagline | `title`, `tagline` in `_config.yml` |
| Masthead topic nav | `_pillars/*.md` (`nav_title`, `order`), then `nav.extra` |
| Hero | `hero.*` in `_config.yml` |
| Question ledger | `ledger.heading`, `ledger.sub`, `ledger.questions[]` |
| "How every answer is built" | `howto.*` |
| Six-topic grid | `_pillars/*.md` — one file per topic |
| Book panel | `book.*` |
| Email capture | `capture.*` |
| Footer | `footer_notes[]` |

Inline HTML is allowed in those config strings; `<em>` renders in the brass
accent colour inside the hero.

## Adding or reordering a topic

Add a file to `_pillars/`. The filename becomes the URL (`permalink: /:name/`),
and the front matter drives both the nav link and the grid card:

```yaml
---
title: "Work &amp; calling"
nav_title: "Work"
order: 7
question_count: 5
blurb: >-
  One or two lines describing the topic.
---
```

Cards and nav links are sorted by `order`, so reordering is a matter of
changing those numbers. The card's `01`-style number is derived from `order`.

## The email form

`capture.action` in `_config.yml` is empty by default, so the form renders
disabled rather than silently posting nowhere. Paste your email provider's
form endpoint there to activate it.

## baseurl

`_config.yml` sets `baseurl: "/stewardship-blog"` so the site works at the
GitHub Pages project URL (`username.github.io/stewardship-blog`). **When the
custom domain is attached, change it to `baseurl: ""`** — every internal link
goes through `relative_url`, so that one line is the only change needed.

## Local development

Requires Ruby (3.2 or 3.3 — the `github-pages` gem pins Jekyll 3.x, which does
not run on Ruby 3.4+).

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000/stewardship-blog/>.

## The landing page (`/start/`)

A no-navigation conversion page. Order: question bubbles → audience spectrum →
six topics → Scripture Index → what's inside it → the book.

The hero reuses `hero.questions`, so the bubbles stay in sync with the
homepage. The "what's inside" list is generated from
`_data/scripture_index.yml`, so it can never drift from the actual index.

Set `landing.action` to your email provider's form endpoint to activate the
form; until then it renders disabled rather than collecting addresses that go
nowhere.

Pages with `minimal: true` render without the masthead and footer.

## The Scripture Index (`/scripture-index/`)

Content lives in `_data/scripture_index.yml` — every passage quoted or
referenced in the book, re-sorted from canonical order into the situation the
reader is in, with paperback page numbers.

Sourced from the book's own Scripture Index (pp. 160–165), mapped to the
chapter each reference is discussed in. **If a passage is not in the book, it
is not in this index** — keep it that way, since the page's whole promise is
that every line is checkable.
