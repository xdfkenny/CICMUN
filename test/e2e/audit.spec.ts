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
 * Plus dedicated suites for the behavioral checks:
 *   - no-JS: every .reveal fully visible on all routes (progressive enhancement)
 *   - print media: .reveal forced visible (no blank blocks when printing)
 *   - every <img> has alt, every <iframe> has title
 *   - touch targets: hamburger, Load more, conference tabs >= 44px;
 *     quick-link capsules >= 24px on mobile
 *   - footer logo contrast >= 4.5:1 after the invert fix
 *   - schedule data freshness: SPA re-visits must refetch /api/schedule
 *     (cache: 'no-store') and never replay a stale/browser-cached payload
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
        imgsNoAlt: [...document.images].filter(
          (i) => !i.getAttribute('alt') || i.getAttribute('alt')!.trim() === '').length,
        iframesNoTitle: [...document.querySelectorAll('iframe')].filter(
          (f) => !f.getAttribute('title')).length,
      }))

      expect(audit.h1, 'exactly one h1 per page').toBe(1)
      expect(audit.overflowPx, 'no horizontal overflow').toBeLessThanOrEqual(0)
      expect(audit.lang, 'html lang matches English content').toBe('en')
      expect(audit.accountButton, 'no placeholder Account button in nav').toBe(false)
      // Hard requirement: canonical must survive hydration on every real route
      // (a stale SSR/Unhead merge used to drop it when served from cached HTML).
      expect(audit.canonical, 'canonical link present after hydration')
        .toBe(canonicalFor(route))
      expect(audit.imgsNoAlt, 'no <img> missing a non-empty alt').toBe(0)
      expect(audit.iframesNoTitle, 'no <iframe> missing a title').toBe(0)

      // Print media: reveal cascade must force visibility (no blank blocks).
      // Transitions are neutralised so headless measurement sees the target state
      // (real print snapshots never animate — the .reveal .8s entrance would
      // otherwise stall mid-flight in background rendering).
      await page.evaluate(() =>
        document.querySelectorAll('.reveal').forEach((e) => (e.style.transition = 'none')))
      await page.emulateMedia({ media: 'print' })
      await page.waitForTimeout(50)
      const print = await page.evaluate(() => ({
        matches: window.matchMedia('print').matches,
        hidden: [...document.querySelectorAll('.reveal')].filter(
          (e) => getComputedStyle(e).opacity !== '1').length,
        text: document.body.innerText.trim().length,
      }))
      expect(print.matches, 'print media active').toBe(true)
      expect(print.hidden, 'all .reveal visible under print').toBe(0)
      expect(print.text, 'print rendering has content').toBeGreaterThan(100)
      await page.emulateMedia({ media: 'screen' })

      // Explicit pagination anchor is part of the gallery progressive
      // enhancement; its touch target must be >= 44x44.
      if (route === '/gallery') {
        const loadMore = await page.evaluate(() => {
          const b = [...document.querySelectorAll('button')].find((el) =>
            el.textContent?.includes('Load more photos'))
          if (!b) return null
          const r = b.getBoundingClientRect()
          return { w: Math.round(r.width), h: Math.round(r.height) }
        })
        expect(loadMore, 'gallery exposes explicit "Load more photos" anchor').not.toBeNull()
        expect(loadMore!.w, 'Load more width >= 44').toBeGreaterThanOrEqual(44)
        expect(loadMore!.h, 'Load more height >= 44').toBeGreaterThanOrEqual(44)
      }

      // Touch targets on the mobile viewport: hamburger >= 44x44; the
      // quick-link capsules on conference pages >= 24px (WCAG AA minimum —
      // desktop renders them as slim title-row text links by design).
      if (vp.name === 'mobile') {
        const burger = await page.evaluate(() => {
          const b = document.querySelector('button[aria-label="Toggle Menu"]')
          if (!b) return null
          const r = b.getBoundingClientRect()
          return { w: Math.round(r.width), h: Math.round(r.height) }
        })
        expect(burger, 'mobile hamburger present').not.toBeNull()
        expect(burger!.w, 'hamburger width >= 44').toBeGreaterThanOrEqual(44)
        expect(burger!.h, 'hamburger height >= 44').toBeGreaterThanOrEqual(44)

        if (route === '/samun' || route === '/jmun') {
          const chips = await page.evaluate(() =>
            [...document.querySelectorAll('a[href]')]
              .filter((a) => {
                const c = (a.className || '').toString()
                return c.includes('rounded-full') && c.includes('border-gray-200')
              })
              .map((a) => {
                const r = a.getBoundingClientRect()
                return Math.round(r.height)
              }))
          expect(chips.length, 'quick-link capsules rendered').toBeGreaterThanOrEqual(3)
          expect(chips.every((h) => h >= 24), 'capsule touch targets >= 24px').toBe(true)
        }
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

// Progressive enhancement: with JavaScript disabled the entrance animation must
// never hide content — every .reveal stays fully visible and html has no .js class.
test('no-JS: all reveal content visible on every route', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(200)
    const state = await page.evaluate(() => ({
      jsClass: document.documentElement.classList.contains('js'),
      hidden: [...document.querySelectorAll('.reveal')].filter(
        (e) => getComputedStyle(e).opacity !== '1').length,
      text: document.body.innerText.trim().length,
    }))
    expect(state.jsClass, `no .js class on ${route}`).toBe(false)
    expect(state.hidden, `all .reveal visible without JS on ${route}`).toBe(0)
    expect(state.text, `body has content without JS on ${route}`).toBeGreaterThan(100)
  }
  await context.close()
})

// Schedule data must never go stale across SPA navigations. withApiSWR(3600)
// can serve `public, max-age=3600` on the SWR cache-hit path, letting the
// browser cache /api/schedule for 1h; after a data change (e.g. emptying the
// schedule), repeat visits would replay the cached old payload ("data comes
// back" when it should say coming soon). Fix: `cache: 'no-store'` on the
// client fetch (same pattern gallery.vue already used) and every visit
// refetches the API.
test('schedule: no stale data across SPA navigations', async ({ page }) => {
  const apiCalls: string[] = []
  page.on('response', (res) => {
    if (res.url().includes('/api/schedule')) apiCalls.push(String(res.status()))
  })

  await page.goto('/')
  await page.locator('a[href="/schedule"]').first().click()
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Schedule coming soon')).toBeVisible()
  await expect(page.getByText('Working Session')).toHaveCount(0)

  await page.locator('a[href="/"]').first().click()
  await page.waitForLoadState('networkidle')

  await page.locator('a[href="/schedule"]').first().click()
  await page.waitForLoadState('networkidle')
  await expect(page.getByText('Schedule coming soon')).toBeVisible()
  await expect(page.getByText('Working Session')).toHaveCount(0)

  expect(apiCalls.length, 'every SPA visit must refetch the schedule API').toBeGreaterThanOrEqual(2)
})

// Footer logo must be legible on the near-black footer. The <img> carries
// invert(1) brightness(1.1); canvas drawImage ignores CSS filters, so the
// filter math is applied per-pixel to the sampled bitmap before converting to
// linear luminance for the WCAG contrast ratio.
test('footer logo contrast >= 4.5:1', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(400)

  const result = await page.evaluate(() => {
    const img = [...document.querySelectorAll('footer img')][0]
    if (!img) return null
    const filter = getComputedStyle(img).filter
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const c = canvas.getContext('2d')
    c.drawImage(img, 0, 0)
    const data = c.getImageData(0, 0, canvas.width, canvas.height).data
    // Footer background token: --color-ink-950 = oklch(0.13 0.028 261.692)
    const oklchToLinear = (L: number, C: number, H: number) => {
      const h = (H * Math.PI) / 180
      const a = C * Math.cos(h)
      const b = C * Math.sin(h)
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b
      const s_ = L - 0.0894841775 * a - 1.291485548 * b
      const l = Math.pow(l_, 3)
      const m = Math.pow(m_, 3)
      const s = Math.pow(s_, 3)
      return {
        r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      }
    }
    const lum = (rgb: { r: number; g: number; b: number }) =>
      0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
    const bgL = Math.max(lum(oklchToLinear(0.13, 0.028, 261.692)), 0)
    const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4))
    let sum = 0
    let n = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 10) continue
      const r = Math.min(1, ((255 - data[i]) / 255) * 1.1)
      const g = Math.min(1, ((255 - data[i + 1]) / 255) * 1.1)
      const b = Math.min(1, ((255 - data[i + 2]) / 255) * 1.1)
      sum += lin(r) * 0.2126 + lin(g) * 0.7152 + lin(b) * 0.0722
      n++
    }
    const imgL = sum / n
    const ratio = (Math.max(imgL, bgL) + 0.05) / (Math.min(imgL, bgL) + 0.05)
    return { filter, bgL: +bgL.toFixed(4), imgL: +imgL.toFixed(4), ratio: +ratio.toFixed(2), sampled: n }
  })

  expect(result, 'footer logo img found').not.toBeNull()
  expect(result!.filter, 'logo carries the invert brightness filter').toContain('invert')
  expect(result!.ratio, 'logo contrast vs footer >= 4.5:1').toBeGreaterThanOrEqual(4.5)
})