# Jade Group Website

A modern redesign of [jadegroup.mu](https://www.jadegroup.mu/) — Jade Group, a Mauritian real estate company active in property development, management and investment since 1976.

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home — hero, key figures, services, featured projects, company timeline |
| `about.html` | Company story, values and the three pillars (development, management, investment) |
| `projects.html` | Full portfolio with sector filters (Office / Commercial / Residential / Land Parceling) |
| `contact.html` | Contact details, enquiry form and directions |

## Tech

Pure static HTML/CSS/JS — no build step, no dependencies. Deploy anywhere (GitHub Pages, Netlify, any web host) by serving the repository root.

To preview locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Customising

- **Project imagery** — project cards currently use stylised inline SVG illustrations as placeholders. To use real photos, replace each `<svg>` inside `.project-media` with an `<img src="images/....jpg" alt="...">`.
- **Contact form** — the form opens the visitor's email client addressed to `marketing@jadegroup.mu`. For server-side submission, point the form at a service such as Formspree and remove the mailto handler in `js/main.js`.
- **Colours & fonts** — all brand colours are CSS variables at the top of `css/style.css`. Fonts are Playfair Display (headings) and Inter (body) via Google Fonts.
- **Content** — company facts (founded 1976, 20+ office buildings, project list, contact details) were sourced from the previous website and public directories; adjust anything that has changed.
