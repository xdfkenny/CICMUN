/**
 * Imports media metadata from a public Google Drive folder into
 * data/gallery.json WITHOUT downloading any media. Images are hotlinked via
 * Drive's CDN (lh3.googleusercontent.com), which serves resized variants.
 *
 * Uses the public `embeddedfolderview` endpoint, which lists every entry of a
 * folder as plain HTML (no pagination/virtualization issues).
 *
 * Usage: node scripts/import-drive-gallery.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT_FOLDER_ID = '18Ja_u8WDmMlOURZFlO1w1S9rfzoSKPRy'
const EVENT_ID = 'jmun-2026'
const EVENT_NAME = 'JMUN 2026'
const IMAGE_RE = /\.(jpe?g|png|webp)$/i

const dataDir = path.resolve('data')
const outputFile = path.join(dataDir, 'gallery.json')
const manifestFile = path.join(dataDir, `${EVENT_ID}-drive-manifest.json`)

const driveCdnUrl = (fileId, width) => `/gallery-media/${fileId}?w=${width}`

async function fetchFolderEntries(folderId) {
  const url = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    throw new Error(`Failed to list folder ${folderId}: HTTP ${res.status}`)
  }
  const html = await res.text()

  const blocks = html.split('id="entry-').slice(1)
  const entries = []
  for (const block of blocks) {
    const id = block.match(/^([-\w]{20,})/)?.[1]
    const name = block.match(/flip-entry-title">([^<]+)<\/div>/)?.[1]
    if (!id || !name) continue
    const header = block.split('flip-entry-title')[0]
    const isFolder = header.includes('drive/folders/')
    entries.push({ id, name: decodeEntities(name), isFolder })
  }
  return entries
}

const decodeEntities = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')

const naturalCompare = (a, b) =>
  String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })

async function collectPhotos(folderId, folderName, photos) {
  const entries = await fetchFolderEntries(folderId)
  const images = entries.filter((entry) => !entry.isFolder && IMAGE_RE.test(entry.name))
  const videos = entries.filter((entry) => !entry.isFolder && /\.(mp4|mov|m4v|avi)$/i.test(entry.name))
  const other = entries.length - images.length - videos.length - entries.filter((e) => e.isFolder).length

  images.sort((a, b) => naturalCompare(a.name, b.name))
  photos.push({ folder: folderName, images })
  console.log(
    `  ${folderName}: ${images.length} photos, ${videos.length} videos (skipped), ${other} other (skipped)`,
  )
}

const run = async () => {
  console.log('Scanning Google Drive folder…')
  const rootEntries = await fetchFolderEntries(ROOT_FOLDER_ID)
  const subfolders = rootEntries.filter((entry) => entry.isFolder)
  const looseImages = rootEntries.filter((entry) => !entry.isFolder && IMAGE_RE.test(entry.name))

  const photos = []
  if (looseImages.length) {
    photos.push({ folder: 'General', images: looseImages })
    console.log(`  (root): ${looseImages.length} loose photos`)
  }
  for (const folder of subfolders) {
    await collectPhotos(folder.id, folder.name, photos)
  }

  const total = photos.reduce((sum, group) => sum + group.images.length, 0)
  if (!total) {
    console.error('No photos found — aborting.')
    process.exit(1)
  }

  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(manifestFile, JSON.stringify({ eventId: EVENT_ID, sourceFolderId: ROOT_FOLDER_ID, photos }, null, 2))
  console.log(`\nManifest saved: ${manifestFile} (${total} photos)`)

  // ---- Build gallery entries (hotlinked, nothing downloaded) ----
  const flat = []
  for (const group of photos) {
    for (const image of group.images) {
      flat.push({ fileId: image.id, fileName: image.name, group: group.folder })
    }
  }

  const images = flat.map((entry, idx) => {
    const src960 = driveCdnUrl(entry.fileId, 960)
    return {
      id: `${EVENT_ID}-${idx + 1}`,
      src: src960,
      thumbnail: driveCdnUrl(entry.fileId, 480),
      srcSet: `${driveCdnUrl(entry.fileId, 480)} 480w, ${src960} 960w`,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
      alt: `${EVENT_NAME} photo ${idx + 1}`,
      eventId: EVENT_ID,
      eventName: EVENT_NAME,
      width: 960,
      height: null,
    }
  })

  const gallery = JSON.parse(fs.readFileSync(outputFile, 'utf8'))
  const updated = [
    ...gallery.filter((event) => event.id !== EVENT_ID),
    {
      id: EVENT_ID,
      name: EVENT_NAME,
      imageCount: images.length,
      coverImage: images[0]?.thumbnail ?? null,
      images,
    },
  ].sort((a, b) => naturalCompare(a.name, b.name))

  fs.writeFileSync(outputFile, `${JSON.stringify(updated, null, 2)}\n`)
  console.log(`gallery.json updated: "${EVENT_NAME}" with ${images.length} hotlinked photos.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
