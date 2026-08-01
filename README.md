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
ebene.html           Ebène interactive: cinematic map + on-demand 3D viewer
css/style.css        design system + all sections
css/ebene.css        Ebène map and building viewer
js/main.js           reveals + image depth (vanilla, no deps)
js/project-orbit.js  sticky project orbit + metric sequence (vanilla, no deps)
js/ebene.js          3D viewer interface and project data
js/ebene-scene.js    Three.js scene, landmarks, roads and landscaping
js/projects-data.js  all 29 projects (metadata, copy, optional image paths)
img/buildings/       pre-rendered turntable frames, one folder per building
```

Everything degrades without JavaScript or with reduced motion requested:
the hero photograph, the project photography and the building stills all
remain visible.

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
| Gallery ×6 | Alexander House, Raffles Tower, Barclays House, RiverEdge Trianon, Le Manhattan, St. James Court |
| Project orbit ×10 | Delivered buildings and current architectural renders |

Brand assets supplied by Jade Group are stored in `img/brand/`. The silver
square anchors the project orbit; dark and light wordmarks keep the navigation
legible across paper and photography; the white wordmark signs off the footer.

## The Ebène interactive (`ebene.html`)

The interactive opens on a **photoreal night aerial** of Ebène Cybercity. Jade
beacons identify Alexander House, Barclays House and Raffles Tower in their
real-world context; selecting one updates the project title, metadata and link.
The main view remains photographic so the first impression stays realistic.

`Explore the building` lazily opens the optional **live WebGL district model**.
Alexander House incorporates the supplied CAD-derived STL geometry. Barclays
House and Raffles Tower are lightweight architectural reconstructions based on
the supplied multi-angle render sets. The 3D scene includes roads, the Alexander
House roundabout and parking beside Raffles Tower. Users can drag to orbit,
scroll to move closer, switch buildings and open a project page or exact Google
Maps location. Three.js is vendored in `js/vendor/`, so the experience has no
runtime CDN dependency.

Source CAD and reference material is in `assets-in/` (git-ignored, not
deployed).

## Source assets and deployment

`assets-in/` holds raw CAD, renders and reference photography, plus the
design-QA log and its screenshots. It is excluded from git (`.gitignore`)
**and** from deployment (`.vercelignore`). Keep internal material there —
anything left in the project root is copied into the live site.

## Metadata, sharing and SEO

Every page carries Open Graph and Twitter Card tags, a canonical link and a
`theme-color`; the homepage also has `RealEstateAgent` JSON-LD (address, phone,
founding year, coordinates) for local search. `img/og-cover.jpg` (1200×630) is
the share image — the three Ebène landmarks at night.

**The canonical host is `https://www.jadegroup.mu`.** If the site is served
anywhere else, update it in all four pages plus `robots.txt` and `sitemap.xml`.

`sitemap.xml` is generated, not hand-written — it lists the three real pages
plus one entry per project. Regenerate it whenever projects change; the
snippet that builds it reads slugs straight out of `js/projects-data.js`.

### Known limitation — per-project social previews

Every project shares one file via `project.html?p=<slug>`. The page rewrites
its own title, description and `og:*` tags for the project being viewed, which
**Google honours** because it renders JavaScript. **WhatsApp and Facebook do
not run JavaScript**, so they fall back to the generic defaults in the HTML —
every project link previews as "Projects — Jade Group".

Fixing it properly means one static file per project (e.g. `p/alexander-house.html`)
with the tags baked in, generated from `js/projects-data.js`. That also improves
crawlability. It changes project URLs, so it is a deliberate step, not a tweak.

## Content notes

- All facts (dates, names, project floors, contacts) are from the current
  jadegroup.mu site; the lorem-ipsum block and template contact info from
  the old site were **not** carried over.
- Kingsgate Tower has no public description yet — currently "Details to
  be announced."
- Copy fixes applied vs. old site: "Sandard Chartered" → Standard Chartered
  (not referenced), consistent naming throughout.
