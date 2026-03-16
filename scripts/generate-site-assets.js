import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const scripts = [
  'generate-committee-images.js',
  'generate-gallery.js',
  'generate-sitemap.js',
  'generate-public-assets-manifest.js',
  'validate-build-assets.js',
]

const clearStaleGalleryCaches = () => {
  const galleryCacheDir = path.resolve('.nuxt/cache/nitro/routes/_')
  if (!fs.existsSync(galleryCacheDir)) return

  const cacheEntries = fs.readdirSync(galleryCacheDir)
    .filter((entry) => entry.startsWith('apigallery.') && entry.endsWith('.json'))

  for (const cacheEntry of cacheEntries) {
    fs.rmSync(path.join(galleryCacheDir, cacheEntry), { force: true })
  }

  if (cacheEntries.length > 0) {
    console.log(`Cleared ${cacheEntries.length} stale gallery route cache file${cacheEntries.length === 1 ? '' : 's'} from ${galleryCacheDir}`)
  }
}

for (const script of scripts) {
  const scriptPath = path.resolve('scripts', script)
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit',
    env: process.env,
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

clearStaleGalleryCaches()
