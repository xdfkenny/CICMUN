import { expect, test } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Welcome to CICMUN' })).toBeVisible()
})

test('conference pages and committee detail render', async ({ page }) => {
  await page.goto('/jmun')
  await expect(page.getByRole('heading', { name: 'JMUN 2026' })).toBeVisible()

  await page.goto('/samun')
  await expect(page.getByText('Official committee list not yet published')).toBeVisible()

  await page.goto('/committees/1')
  await expect(page.getByRole('heading', { name: 'UNSC' })).toBeVisible()
})

test('gallery and resources routes render', async ({ page }) => {
  const galleryAssetErrors: string[] = []

  page.on('response', (response) => {
    const url = response.url()
    if ((url.includes('/gallery/__thumbs/') || url.includes('/gallery-origins/')) && response.status() >= 400) {
      galleryAssetErrors.push(`${response.status()} ${url}`)
    }
  })

  await page.goto('/gallery')
  await expect(page.getByRole('heading', { name: 'Photo Gallery' })).toBeVisible()
  await expect(page.locator('img[alt*="photo"]').first()).toBeVisible()

  await page.getByRole('button', { name: /open .*photo/i }).first().click()
  await expect(page.getByRole('dialog', { name: 'Image Gallery' })).toBeVisible()
  await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src', /\/gallery-origins\//)
  expect(galleryAssetErrors).toEqual([])

  await page.goto('/resources')
  await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible()
})

test('health endpoint responds with structured status', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.ok()).toBeTruthy()

  const payload = await response.json()
  expect(payload).toMatchObject({
    service: 'cicmun-portal',
    checks: {
      committees: {
        counts: {
          JMUN: 6,
          SAMUN: 0,
        },
      },
    },
  })
})
