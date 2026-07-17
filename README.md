# Jade Group — Website

A static editorial website for **Jade Group** (jadegroup.mu) — property development,
management & investment in Mauritius since 1976.

Editorial design: oversized Inter Tight display type + Newsreader serif,
monochrome palette with a single jade-green accent, scroll reveals,
staggered project gallery, a WebGL hero lens, native-scroll image depth,
a scroll-scrubbed project orbit, and dark closing sections.

## Run locally

Any static server works. For example:

```sh
python3 -m http.server 4173
# open http://localhost:4173
```

No build step, no dependencies.

## Structure

```
index.html           home (one long page)
projects.html        full portfolio, grouped by sector
project.html         detail template — renders ?p=<slug> from the data file
css/style.css        design system + all sections
js/main.js           reveals + image depth (vanilla, no deps)
js/webgl-hero.js     progressive WebGL hero lens (vanilla, no deps)
js/project-orbit.js  sticky project orbit + metric sequence (vanilla, no deps)
js/projects-data.js  all 30 projects (metadata, copy, optional image paths)
```

The WebGL layer is optional: the original hero image remains visible when
WebGL is unavailable or the visitor has requested reduced motion.

### Adding or editing a project

Edit `js/projects-data.js` — each entry drives its row on `projects.html`,
its detail page at `project.html?p=<slug>`, and the next-project link.
`location`, `floors`, `body`, and `features` may be `null`; the detail page
hides those fields automatically. `images` is an optional array of local image
paths; one image switches the detail gallery to a single wide frame. An unknown
slug redirects to the listing.

## Photography

The homepage, project orbit, and selected detail pages use first-party
photography from the existing Jade Group website (https://www.jadegroup.mu/),
stored locally in `img/`.
Projects not yet migrated keep a labelled placeholder. To replace one:

1. Drop the image in an `img/` folder.
2. Add its path to the project record's `images` array.
3. For homepage editorial placements, use the existing `project-photo` figure
   pattern and provide concise, descriptive alternative text.

Current homepage image set:

| Slot | Suggested shot |
|---|---|
| Hero | Ebène Cybercity night panorama |
| Gallery ×6 | Alexander House, Raffles Tower, Barclays House, Moorgate House, Orchard Center, St. James Court |
| Project orbit ×10 | Delivered buildings and current architectural renders |

Brand assets supplied by Jade Group are stored in `img/brand/`. The silver
square anchors the project orbit; dark and light wordmarks keep the navigation
legible across paper and photography; the white wordmark signs off the footer.

## Content notes

- All facts (dates, names, project floors, contacts) are from the current
  jadegroup.mu site; the lorem-ipsum block and template contact info from
  the old site were **not** carried over.
- Kingsgate Tower has no public description yet — currently "Details to
  be announced."
- Copy fixes applied vs. old site: "Sandard Chartered" → Standard Chartered
  (not referenced), consistent naming throughout.
