import fs from 'node:fs'
import path from 'node:path'

const DEFAULT_SITE_URL = 'https://cicmun.qzz.io/'
const committeesPath = path.resolve('data/committees.json')
const outputPath = path.resolve('public/sitemap.xml')

const siteUrl = new URL(process.env.SITE_URL?.trim() || DEFAULT_SITE_URL)
const lastmod = new Date().toISOString().slice(0, 10)

const staticRoutes = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/delegates', changefreq: 'monthly', priority: '0.8' },
  { path: '/samun', changefreq: 'weekly', priority: '0.8' },
  { path: '/jmun', changefreq: 'weekly', priority: '0.8' },
  { path: '/gallery', changefreq: 'monthly', priority: '0.6' },
  { path: '/resources', changefreq: 'weekly', priority: '0.7' },
  { path: '/schedule', changefreq: 'weekly', priority: '0.7' },
]

const committeeRoutes = (() => {
  const raw = JSON.parse(fs.readFileSync(committeesPath, 'utf8'))
  if (!Array.isArray(raw)) return []

  return raw
    .map((committee) => Number(committee?.id))
    .filter((id) => Number.isInteger(id) && id > 0)
    .sort((a, b) => a - b)
    .map((id) => ({
      path: `/committees/${id}`,
      changefreq: 'monthly',
      priority: '0.5',
    }))
})()

const buildUrlEntry = ({ path: routePath, changefreq, priority }) => {
  const loc = new URL(routePath.replace(/^\//, ''), siteUrl).toString()

  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...staticRoutes.map(buildUrlEntry),
  ...committeeRoutes.map(buildUrlEntry),
  '</urlset>',
  '',
].join('\n')

fs.writeFileSync(outputPath, xml)
console.log(`Generated sitemap at ${outputPath}`)
