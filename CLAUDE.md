# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Preview locally
npm run dev          # serves at http://localhost:3000

# Deploy to GitHub Pages (pushes to gh-pages branch)
npm run deploy

# Regenerate the PDF from resume-print.html (requires Chrome + npm install)
npm run pdf
```

After any content change, always regenerate the PDF and commit both `index.html`/`resume-print.html` and `Vishak_Bharadwaj_Resume.pdf` together.

## Architecture

This is a zero-build static site — no bundler, no framework. GitHub Pages serves `index.html` directly from the `main` branch root.

### Two HTML files, one source of truth

| File | Purpose |
|---|---|
| `index.html` | The public website — full detail, scroll animations, dark hero, sticky nav |
| `resume-print.html` | Print-optimised source for the downloadable PDF — same content, condensed layout, `@page { size: 210mm 370mm }` |
| `Vishak_Bharadwaj_Resume.pdf` | Pre-generated from `resume-print.html` via Chrome headless; committed to the repo so it downloads correctly from GitHub Pages |

Any content edit (job bullet, project, skill) must be made in **both** HTML files. `index.html` can be more verbose; `resume-print.html` must stay within the extended A4 page.

### Key CSS patterns

- `resume-print.html` uses `@page { size: 210mm 370mm; margin: 0; }` — slightly taller than A4 to fit all content on one page.
- Bullet lists use `position: relative` on `<li>` with an `::before` pseudo-element for the bullet glyph. **Do not use `display: flex` on `<li>` elements** — it causes `<strong>` tags to become separate flex columns.
- `index.html` uses `IntersectionObserver` for `.fade-in` scroll animations and a scroll-based nav style toggle (`nav.scrolled`).

### Deployment

The site is live at **https://vishakbharadwaj94.github.io/vishak-bharadwaj-resume/**
Repo: `VishakBharadwaj94/vishak-bharadwaj-resume` (personal GitHub account, not InMobi).
Push to `main` — GitHub Pages rebuilds automatically within ~30 seconds.

When pushing, use the personal account token:
```bash
TOKEN=$(gh auth token --user VishakBharadwaj94)
git remote set-url origin "https://VishakBharadwaj94:${TOKEN}@github.com/VishakBharadwaj94/vishak-bharadwaj-resume.git"
```
