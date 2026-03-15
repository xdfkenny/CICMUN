import { createError } from 'h3'
import type { GalleryEvent, GalleryResponse } from '../../shared/gallery'
import { loadGalleryDataSnapshot } from '../utils/gallery-data'
import { buildGalleryResponse, normalizeGalleryQuery } from '../utils/gallery'

export default defineEventHandler((event): GalleryResponse => {
  if (process.env.NODE_ENV !== 'production') {
    setResponseHeader(event, 'cache-control', 'no-store')
  }

  try {
    const { events, revision } = loadGalleryDataSnapshot()
    return buildGalleryResponse(events as GalleryEvent[], normalizeGalleryQuery(getQuery(event)), revision)
  } catch (error) {
    console.error('[gallery] Failed to load gallery metadata.', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Gallery metadata unavailable.',
    })
  }
})
