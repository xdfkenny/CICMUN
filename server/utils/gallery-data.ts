import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import type { GalleryEvent } from '../../shared/gallery'
import galleryDataRaw from '../../data/gallery.json'

const GALLERY_DATA_PATH = path.resolve(process.cwd(), 'data/gallery.json')
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
const BUNDLED_GALLERY_DATA = galleryDataRaw as GalleryEvent[]
const BUNDLED_GALLERY_REVISION = createHash('sha1')
  .update(JSON.stringify(galleryDataRaw))
  .digest('hex')
  .slice(0, 12)

export interface GalleryDataSnapshot {
  events: GalleryEvent[]
  revision: string
}

let cachedGalleryData: GalleryEvent[] | null = null
let cachedGalleryDataMtimeMs = -1

export const parseGalleryData = (contents: string): GalleryEvent[] => {
  const parsed: unknown = JSON.parse(contents)

  if (!Array.isArray(parsed)) {
    throw new Error('Gallery metadata must be an array.')
  }

  return parsed as GalleryEvent[]
}

export const loadGalleryDataFromFile = (filePath: string): GalleryEvent[] =>
  parseGalleryData(fs.readFileSync(filePath, 'utf8'))

export const loadGalleryData = (): GalleryEvent[] => {
  return loadGalleryDataSnapshot().events
}

export const loadGalleryDataSnapshot = (): GalleryDataSnapshot => {
  if (!IS_DEVELOPMENT) {
    return {
      events: BUNDLED_GALLERY_DATA,
      revision: BUNDLED_GALLERY_REVISION,
    }
  }

  if (!fs.existsSync(GALLERY_DATA_PATH)) {
    return {
      events: BUNDLED_GALLERY_DATA,
      revision: BUNDLED_GALLERY_REVISION,
    }
  }

  const stat = fs.statSync(GALLERY_DATA_PATH)
  const shouldRefreshCache = IS_DEVELOPMENT || !cachedGalleryData || stat.mtimeMs !== cachedGalleryDataMtimeMs

  if (shouldRefreshCache) {
    cachedGalleryData = loadGalleryDataFromFile(GALLERY_DATA_PATH)
    cachedGalleryDataMtimeMs = stat.mtimeMs
  }

  return {
    events: cachedGalleryData,
    revision: `${cachedGalleryDataMtimeMs}`,
  }
}
