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

## Contextual resources (the "next step" panel)

Modelled on Stay22's pattern: monetise intent the reader already has by
offering a genuinely useful next step, rather than serving an ad.

- `_data/resources.yml` holds the resources, each tagged with `topics` (pillar
  slugs) and a `stance` of `free` or `commercial`.
- Each pillar carries `reader_state: raw | steady | planning` in its front
  matter.
- **On `raw` pages (debt, anxiety) every commercial resource is withheld** and
  a care note replaces it. This is the rule that makes the pattern safe on a
  site about money shame — do not soften it.

Affiliate tags live only in `_config.yml` (`affiliates.amazon_tag`,
`affiliates.generic_ref`); `_includes/affiliate-link.html` appends them at
render time so the URLs in the data file stay clean. Leave a tag blank and
those links render bare.

Paid links get `rel="noopener sponsored"`, and the FTC disclosure renders
automatically in any panel containing at least one paid link — and only then.

### Filtering the resource panel

`assets/js/next-step.js` adds a search box above the list. It is progressive
enhancement — the control is `hidden` in the markup and only unhidden by the
script, so a reader without JavaScript sees the plain list instead of a dead
box. Nothing typed leaves the page.

Matching runs against each resource's name, kind, blurb and optional
`keywords` field, ranked by how many query words hit. Add `keywords` to a
resource in `_data/resources.yml` for terms a reader would type that the
blurb does not contain ("credit card", "emergency", "rent").

**A query that matches nothing never empties the panel.** It says so and
restores the full list. A reader who typed their real problem and got "no
results" is worse off than one who was never offered a box — keep that
behaviour if you change this file.

### Intent chips

`_data/intents.yml` holds one-tap chips per topic, written in the reader's own
voice — the same register as the front-page question bubbles. They exist
because this site's reader often cannot name their problem in search terms,
which is the premise of the book.

Each chip carries a `query` of keyword soup that drives the same ranking
engine as the search box. **It is never shown to the reader** — the chip shows
their words, the matching uses ours. Typing always overrides an active chip.

Keep to three or four per topic; more reads as a menu and defeats the point.
A topic with no entry renders the search box without chips.
