<p align="center">
  <img src="public/images/og-image.png" alt="CICMUN 2026" width="100%">
</p>

<h1 align="center">CICMUN Delegate Portal</h1>

<p align="center">
  Official delegate portal for CICMUN 2026 — committees, schedules, resources, and gallery.
</p>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#scripts">Scripts</a> •
  <a href="#project-structure">Structure</a>
</p>

---

## Tech Stack

- [Nuxt 4](https://nuxt.com/) & Vue 3
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Nitro](https://nitro.unjs.io/) server routes
- [`@nuxt/image`](https://image.nuxt.com/) for optimized assets
- JSON-backed content

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Unit tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run prebuild` | Generate all assets (images, gallery, sitemap) |

### Asset Generation

```bash
npm run generate:committee-images   # Committee hero placeholders
npm run generate:gallery             # Gallery metadata & thumbnails
npm run migrate:gallery-origins      # Migrate to gitignored originals
npm run generate:sitemap             # Generate sitemap.xml
```

## Project Structure

```
app/              # Pages, components, layouts, composables
server/api/       # Nitro API routes
server/plugins/   # Logging & security headers
server/utils/     # Data loading & helpers
data/             # JSON datasets (committees, events, schedule, etc.)
public/           # Static assets, generated images, PDFs
scripts/          # Build-time generators
```

## Environment Variables

| Variable | Description |
|---|---|
| `GALLERY_ORIGIN_BASE_URL` | CDN base URL for original gallery images |
| `GALLERY_SOURCE_DIR` | Local gallery source directory (default: `public/gallery-origins`) |
| `SITE_URL` | Public deployment URL for sitemap generation |

## Content Notes

- `data/committees.json` is the source of truth for committees.
- Only the JMUN committee dataset is currently published.
- The SAMUN route is production-ready but hidden until the approved committee list is provided.
- Resources referenced in datasets must exist in `public/resources/`.

---

<p align="center">Built with Nuxt for CICMUN 2026.</p>
