import {
  DEFAULT_GALLERY_LIMIT,
  MAX_GALLERY_LIMIT,
  type GalleryEvent,
  type GalleryResponse,
} from '../../shared/gallery'

export interface NormalizedGalleryQuery {
  eventId: string
  page: number
  limit: number
  metaOnly: boolean
}

const parsePositiveInteger = (value: unknown, fallback: number, max: number) => {
  const parsed = Number.parseInt(typeof value === 'string' ? value : '', 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(max, Math.max(1, parsed))
}

export const normalizeGalleryQuery = (query: Record<string, unknown>): NormalizedGalleryQuery => ({
  eventId: typeof query.event === 'string' ? query.event : 'all',
  page: parsePositiveInteger(query.page, 1, Number.MAX_SAFE_INTEGER),
  limit: parsePositiveInteger(query.limit, DEFAULT_GALLERY_LIMIT, MAX_GALLERY_LIMIT),
  metaOnly: query.metaOnly === '' || query.metaOnly === 'true' || query.metaOnly === true,
})

export const buildGalleryResponse = (
  eventsList: GalleryEvent[],
  query: NormalizedGalleryQuery,
  revision: string | null = null,
): GalleryResponse => {
  const eventsMeta = eventsList.map((event) => ({
    id: event.id,
    name: event.name,
    imageCount: event.imageCount,
    coverImage: event.coverImage,
  }))

  if (query.metaOnly) {
    return {
      events: eventsMeta,
      images: [],
      total: 0,
      page: 1,
      limit: 0,
      revision,
    }
  }

  const allImages = query.eventId === 'all'
    ? eventsList.flatMap((event) => event.images)
    : (eventsList.find((event) => event.id === query.eventId)?.images ?? [])

  const startIndex = (query.page - 1) * query.limit
  const endIndex = startIndex + query.limit

  return {
    events: eventsMeta,
    images: allImages.slice(startIndex, endIndex),
    total: allImages.length,
    page: query.page,
    limit: query.limit,
    revision,
  }
}

export const getGalleryMetrics = (eventsList: GalleryEvent[]) => ({
  eventCount: eventsList.length,
  imageCount: eventsList.reduce((sum, event) => sum + event.imageCount, 0),
})
