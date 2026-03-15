# CICMUN Delegate Portal

Nuxt 4 delegate portal for CICMUN 2026. The app serves conference pages, committee details, gallery metadata, delegate resources, and schedule content from local JSON datasets exposed through Nitro API routes.

## Stack

- Nuxt 4 and Vue 3
- Nitro server routes under `server/api`
- Tailwind CSS 4
- `@nuxt/image` for optimized image delivery
- JSON-backed content under `data/`
- Prebuild asset generation scripts under `scripts/`

## Project Layout

- `app/`: pages, components, layouts, composables, and client utilities
- `server/api/`: server endpoints consumed by the frontend
- `server/plugins/`: runtime observability and response hardening
- `server/utils/`: data loading, validation, and gallery helpers
- `data/`: source datasets for committees, events, resources, schedule, and generated gallery metadata
- `public/`: static assets, generated committee placeholders, thumbnails, PDFs, and sitemap
- `scripts/`: build-time generators for gallery metadata, committee placeholders, and sitemap output

## Local Development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run preview
npm run lint
npm run test:unit
npm run test:e2e
```

## Generated Assets

`npm run prebuild` now runs the full site asset pipeline:

1. Generate deterministic local committee hero placeholders in `public/committee-images/generated/`
2. Generate gallery metadata and thumbnails in `data/gallery.json` and `public/gallery/__thumbs/`
3. Generate `public/sitemap.xml`

You can also run the steps independently:

```bash
npm run generate:committee-images
npm run generate:gallery
npm run migrate:gallery-origins
npm run generate:sitemap
```

## Content Notes

- `data/committees.json` is the committee source of truth.
- Only the JMUN committee dataset is currently published.
- The SAMUN route is production-ready but intentionally shows an explicit unpublished state until the approved committee list is provided.
- Resources referenced from committee or portal datasets must exist in `public/resources/`.

## Gallery CDN Support

Original gallery files are expected to live outside the tracked `public/gallery/__thumbs` tree. After running `npm run migrate:gallery-origins`, originals live in the gitignored `public/gallery-origins/` directory and only generated thumbnails remain tracked.

Set `GALLERY_ORIGIN_BASE_URL` to the public base URL that serves the original gallery images. Example:

```bash
GALLERY_ORIGIN_BASE_URL=https://cdn.example.com/gallery/
```

You can also override the local originals source directory at generation time:

```bash
GALLERY_SOURCE_DIR=public/gallery-origins
```

When `GALLERY_ORIGIN_BASE_URL` is set, generated gallery metadata keeps local thumbnails in-app but points original `src` URLs to that external origin. When it is not set, metadata points to the local public source directory instead.

## Sitemap

Set `SITE_URL` if the deployed public URL is different from the default:

```bash
SITE_URL=https://example.com/
```

The sitemap generator uses that base URL and includes static routes plus committee detail routes derived from `data/committees.json`.

## Health and Observability

- `GET /api/health` returns structured health data for committees, events, resources, and gallery metadata.
- Nitro request logging emits structured JSON with request ID, path, status code, and duration.
- `x-powered-by` is stripped at runtime and security headers are applied with route rules.

## CI

GitHub Actions runs linting, unit tests, build validation, and Playwright smoke tests on every push and pull request.
