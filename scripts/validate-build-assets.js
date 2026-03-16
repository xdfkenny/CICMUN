import fs from 'node:fs'
import path from 'node:path'

const publicAssetsPath = path.resolve('data/public-assets.json')
const resourcesPath = path.resolve('data/resources.json')
const committeesPath = path.resolve('data/committees.json')
const galleryPath = path.resolve('data/gallery.json')

const publicAssets = new Set(JSON.parse(fs.readFileSync(publicAssetsPath, 'utf8')))
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'))
const committees = JSON.parse(fs.readFileSync(committeesPath, 'utf8'))
const galleryEvents = JSON.parse(fs.readFileSync(galleryPath, 'utf8'))
const errors = []

const normalizePublicPath = (value) => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return null

  const [pathname] = trimmed.split('?')
  const segments = pathname.split('/').filter(Boolean)
  if (!segments.length) return '/'

  try {
    return `/${segments.map((segment) => encodeURIComponent(decodeURIComponent(segment))).join('/')}`
  } catch {
    return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`
  }
}

const hasPublicAsset = (value) => {
  const normalized = normalizePublicPath(value)
  return normalized ? publicAssets.has(normalized) : false
}

const assertPublicAsset = (label, value) => {
  if (typeof value !== 'string' || !value.trim()) return
  if (!value.startsWith('/')) return
  if (!hasPublicAsset(value)) {
    errors.push(`${label} missing public asset: ${value}`)
  }
}

const assertResourceFile = (label, filename) => {
  if (typeof filename !== 'string' || !filename.trim()) return

  const publicPath = `/resources/${encodeURIComponent(filename)}`
  if (!publicAssets.has(publicPath)) {
    errors.push(`${label} missing resource file: ${filename}`)
  }
}

for (const resource of resources) {
  assertResourceFile(`resource:${resource.id ?? 'unknown'}`, resource.filename)
}

for (const committee of committees) {
  assertPublicAsset(`committee:${committee.id}:image`, committee.image)
  assertPublicAsset(`committee:${committee.id}:chairPhoto`, committee.chairPhoto)
  assertPublicAsset(`committee:${committee.id}:coChairPhoto`, committee.coChairPhoto)
  assertPublicAsset(`committee:${committee.id}:secretaryPhoto`, committee.secretaryPhoto)

  if (Array.isArray(committee.resources)) {
    for (const [index, resource] of committee.resources.entries()) {
      assertResourceFile(`committee:${committee.id}:resources[${index}]`, resource?.filename)
    }
  }
}

for (const event of galleryEvents) {
  assertPublicAsset(`gallery:${event.id}:coverImage`, event.coverImage)

  if (!Array.isArray(event.images)) continue

  for (const [index, image] of event.images.entries()) {
    assertPublicAsset(`gallery:${event.id}:images[${index}].thumbnail`, image?.thumbnail)
    assertPublicAsset(`gallery:${event.id}:images[${index}].src`, image?.src)

    if (typeof image?.srcSet === 'string') {
      for (const candidate of image.srcSet.split(',')) {
        const [url] = candidate.trim().split(/\s+/, 1)
        assertPublicAsset(`gallery:${event.id}:images[${index}].srcSet`, url)
      }
    }
  }
}

if (errors.length) {
  console.error('Build asset validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('Build asset validation passed.')
