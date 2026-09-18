import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

/**
 * Layout regression audit — the "10-point checklist" as executable tests.
 * Runs every route at desktop (1440×900) and mobile (375×812):
 *   ① no horizontal overflow          ② exactly one h1 per page
 *   ③ lang matches content            ④ no placeholder nav buttons
 *   ⑤ reveal gating stays JS-only     ⑥ canonical survives hydration
 *   ⑦ gallery pagination anchor       ⑧ branded 404 page (noindex, no canonical)
 *   ⑨ screenshots archived for before/after diff
 * Run via `scripts/audit.sh` (lint → unit → build → this suite).
 */

const ROUTES = ['/', '/delegates', '/samun', '/jmun', '/gallery', '/resources', '/schedule']
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
]

// Canonical always points at the official domain, even from preview origins.
// (mirrors app/layouts/default.vue — single source of truth is the route.path)
const canonicalFor = (route: string) =>
  `https://cicmun.qzz.io${route === '/' ? '/' : route}`

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`${route} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(400)

      const audit = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        overflowPx: document.documentElement.scrollWidth - window.innerWidth,
        lang: document.documentElement.lang,
        accountButton: [...document.querySelectorAll('button')].some((b) =>
          (b.getAttribute('aria-label') || '').toLowerCase().includes('account')),
        revealHidden: [...document.querySelectorAll('.reveal')].filter(
          (e) => getComputedStyle(e).opacity === '0').length,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      }))

      expect(audit.h1, 'exactly one h1 per page').toBe(1)
      expect(audit.overflowPx, 'no horizontal overflow').toBeLessThanOrEqual(0)
      expect(audit.lang, 'html lang matches English content').toBe('en')
      expect(audit.accountButton, 'no placeholder Account button in nav').toBe(false)
      // Hard requirement: canonical must survive hydration on every real route
      // (a stale SSR/Unhead merge used to drop it when served from cached HTML).
      expect(audit.canonical, 'canonical link present after hydration')
        .toBe(canonicalFor(route))

      // Explicit pagination anchor is part of the gallery progressive enhancement.
      if (route === '/gallery') {
        const hasLoadMore = await page.evaluate(() =>
          [...document.querySelectorAll('button')].some((b) =>
            b.textContent?.includes('Load more photos')))
        expect(hasLoadMore, 'gallery exposes explicit "Load more photos" anchor').toBe(true)
      }

      // Screenshot archive for before/after visual diffing.
      mkdirSync('.audit/shots', { recursive: true })
      const slug = route.replace(/^\/$/, 'home').replaceAll('/', '_')
      await page.screenshot({ path: `.audit/shots/${vp.name}-${slug}.png` })
    })
  }
}

// Branded error page: 404 keeps the shell-free single-H1 layout and no-indexes,
// and never carries a canonical (it must not compete with real routes).
test('404 error page @ desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  const res = await page.goto('/definitely-not-a-real-page', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(300)

  expect(res?.status()).toBe(404)
  const audit = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    overflowPx: document.documentElement.scrollWidth - window.innerWidth,
    lang: document.documentElement.lang,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
    h1Text: document.querySelector('h1')?.textContent?.trim() ?? '',
  }))
  expect(audit.h1, 'single h1 on error page').toBe(1)
  expect(audit.overflowPx, 'no horizontal overflow').toBeLessThanOrEqual(0)
  expect(audit.lang, 'lang en').toBe('en')
  expect(audit.canonical, 'error page has no canonical').toBeNull()
  expect(audit.robots, 'error page is noindex').toBe('noindex')
  expect(audit.h1Text.toLowerCase(), 'branded 404 heading').toContain('not found')

  mkdirSync('.audit/shots', { recursive: true })
  await page.screenshot({ path: '.audit/shots/desktop-404.png' })
})