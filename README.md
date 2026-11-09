<p align="center">
  <img src="public/images/og-image.png" alt="CICMUN 2027" width="100%">
</p>

<h1 align="center">CICMUN Delegate Portal</h1>

<p align="center">
  Official delegate portal for CICMUN 2027 — committees, schedules, resources, and gallery.
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
- The SAMUN 2026 committee dataset is published (6 committees); the JMUN dataset is empty until it is republished.
- Staff photo fields (`chairPhoto`, `coChairPhoto`, `secretaryPhoto`) must stay `null` in `data/committees.json` — photos of committee staff are sensitive and are not published on the site; the UI renders initials avatars instead.
- Resources referenced in datasets must exist in `public/resources/`.

---

## Deployment

Automated deploys run on GitHub Actions:

| Workflow | When | What it does |
|---|---|---|
| `ci.yml` | Every push / PR | Lint, unit tests, build, Playwright smoke tests |
| `deploy.yml` | After `CI` succeeds on `main`, or manual dispatch | Builds the static site and mirrors it to the FTP host |

### Required secrets

Add these under **Settings → Secrets and variables → Actions → Repository secrets**:

| Secret | Description |
|---|---|
| `FTP_USERNAME` | FTP account username |
| `FTP_PASSWORD` | FTP account password |

### FTP configuration

The host, protocol, port, and target directory live in `.github/workflows/deploy.yml`:

| Variable | Default | Notes |
|---|---|---|
| `FTP_HOST` | `ftp.cicmun.cic-caracas.com` | |
| `FTP_PROTOCOL` | `ftps` | `ftp`, `ftps` (explicit TLS), or `sftp` |
| `FTP_PORT` | `21` | Use `22` for `sftp` |
| `FTP_REMOTE_DIR` | `public_html/` | Target directory on the server |

The deploy uses `lftp mirror -R --delete`, so files removed from the build are removed on the server. Server-managed files (`.htaccess`, `.user.ini`, `.well-known/`, `cgi-bin/`, `.ftpquota`) are excluded and never deleted.

To deploy by hand, run **Deploy to FTP** from the Actions tab (`Run workflow`).

> **Note:** the site is built as a static bundle. Nitro API routes (`/api/*`) are not available on static-only hosting, so dynamic gallery pagination/filtering and client-side `/api/*` refreshes need a static-data or prerender strategy if the target host cannot run Node.

---

<p align="center">Built with Nuxt for CICMUN 2027.</p>
