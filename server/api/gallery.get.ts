import galleryData from '../../data/gallery.json'
import type { GalleryEvent, GalleryResponse } from '../../shared/gallery'

export default defineEventHandler((event): GalleryResponse => {
  const query = getQuery(event)
  const eventId = query.event as string || 'all'
  const parsedPage = Number.parseInt(query.page as string, 10)
  const parsedLimit = Number.parseInt(query.limit as string, 10)
  const page = Number.isFinite(parsedPage) ? Math.max(1, parsedPage) : 1
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, parsedLimit) : 24

  let eventsList = galleryData as GalleryEvent[]

  // Return early with event metadata if requested
  if (query.metaOnly) {
    return {
      events: eventsList.map(e => ({
        id: e.id,
        name: e.name,
        imageCount: e.imageCount,
        coverImage: e.coverImage
      })),
      images: [],
      total: 0,
      page: 1,
      limit: 0
    }
  }

  // Flatten images for the requested event or all events
  let allImages = []
  if (eventId === 'all') {
    allImages = eventsList.flatMap(e => e.images)
  } else {
    allImages = eventsList.find(e => e.id === eventId)?.images || []
  }

  const total = allImages.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  // Omit the high-res "src" attribute for the thumbnail grid 
  // to save bandwidth (unless we actually need it)
  // Actually, we'll keep `src` but we could strip it if we strictly separated thumbnails.
  const paginatedImages = allImages.slice(startIndex, endIndex)

  return {
    events: [],
    images: paginatedImages,
    total,
    page,
    limit
  }
})
