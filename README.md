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

Six per topic. Each must narrow to something — a chip that returns nearly the
whole list teaches the reader the chips do not work. A topic with no entry renders the search box without chips.

### Printing the index

`assets/css/print.css` is linked with `media="print"`, so it never touches the
screen. It strips the masthead, footer, capture forms and the print button
itself, keeps the contents list and all the passages, and sets
`break-inside: avoid` on each row so no reference is split across pages.

The Scripture Index page also carries two print-only blocks — a header naming
the site, and a colophon repeating the footer notes and the domain — so a
printed copy identifies its own source. Both are `hidden` on screen.

`assets/js/print.js` reveals the "Save as PDF" button and wires it to
`window.print()`. The button is hidden in markup, because a control that opens
a print dialog is meaningless without JavaScript; Ctrl/Cmd+P still produces
the same document for those readers.

The printed domain comes from `print.source` in `_config.yml`. **It is set to
stewardshipjourneys.com, not the github.io address** — update it if that
changes, since a printed sheet cannot be corrected after the fact.

### The book on every topic

The book carries `allow_raw: true` in `_data/resources.yml` — the one
commercial resource permitted on `raw` pages. It is the author's own work
rather than a third-party offer. **Nothing else should ever carry that flag**;
the withholding rule is what keeps the debt and anxiety pages safe, and it is
still enforced for every other commercial entry.

Because the book now appears there, `next_step.care_note` says "Everything
below is free except the book" rather than "Nothing on this page is sold to
you". Keep those two in step — if the flag moves, the wording must too.

### Topic icons

Each pillar names an icon in its front matter (`icon: topic-saving.svg`),
resolved from `_includes/`. Same pattern as the mindset icons.

### The book trailer

`site.book.video` points at `assets/video/book-trailer.mp4`. Blank it and no
player renders. `preload="metadata"` means visitors download only a few KB
until they press play.

**The file is 56 MB**, committed to the repo. That is under GitHub's 100 MB
per-file limit but large for the web, and GitHub Pages has a soft 100 GB/month
bandwidth allowance. If it gets popular, re-encode smaller (720p, CRF 28) and
replace the file. An optional `book.video_poster` renders a poster frame.

### Re-encoding the trailer

The source was 1440p at 14 Mbps — 56 MB for 33 seconds, far past what a
736px-wide player needs. The committed file is 1080p, CRF 27, ~11 MB:

```bash
ffmpeg -i source.mp4 -vf "scale=1920:-2" -c:v libx264 -profile:v high \
  -pix_fmt yuv420p -crf 27 -preset slow -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart assets/video/book-trailer.mp4
```

`-movflags +faststart` is not optional: it moves the moov atom ahead of the
media data so playback starts before the file finishes downloading.

The poster is a frame at 27.75s, chosen because **the trailer has burned-in
subtitles** and almost every frame carries one mid-sentence. The gap between
"rooted" and the closing title is one of the few clean moments:

```bash
ffmpeg -ss 27.75 -i source.mp4 -frames:v 1 -vf "scale=1600:-2" -q:v 4 \
  assets/img/book-trailer-poster.jpg
```

If the trailer is ever re-cut, check the new poster frame for a stray caption
before committing it.
