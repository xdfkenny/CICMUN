import { describe, expect, it } from 'vitest'
import type { GalleryEvent } from '../../shared/gallery'
import { buildGalleryResponse, normalizeGalleryQuery } from '../../server/utils/gallery'

const galleryEvents: GalleryEvent[] = [
  {
    id: 'jmun-2025',
    name: 'JMUN 2025',
    imageCount: 2,
    coverImage: '/gallery/__thumbs/jmun-2025.webp',
    images: [
      {
        id: 'jmun-1',
        src: '/gallery/JMUN 2025/001.jpg',
        thumbnail: '/gallery/__thumbs/JMUN 2025/001.webp',
        alt: 'JMUN 2025 photo 1',
        eventId: 'jmun-2025',
        eventName: 'JMUN 2025',
        width: 960,
        height: 540,
      },
      {
        id: 'jmun-2',
        src: '/gallery/JMUN 2025/002.jpg',
        thumbnail: '/gallery/__thumbs/JMUN 2025/002.webp',
        alt: 'JMUN 2025 photo 2',
        eventId: 'jmun-2025',
        eventName: 'JMUN 2025',
        width: 960,
        height: 540,
      },
    ],
  },
  {
    id: 'samun-2025',
    name: 'SAMUN 2025',
    imageCount: 1,
    coverImage: '/gallery/__thumbs/samun-2025.webp',
    images: [
      {
        id: 'samun-1',
        src: '/gallery/SAMUN 2025/001.jpg',
        thumbnail: '/gallery/__thumbs/SAMUN 2025/001.webp',
        alt: 'SAMUN 2025 photo 1',
        eventId: 'samun-2025',
        eventName: 'SAMUN 2025',
        width: 960,
        height: 540,
      },
    ],
  },
]

describe('normalizeGalleryQuery', () => {
  it('falls back to safe defaults for invalid values', () => {
    expect(normalizeGalleryQuery({
      event: 42,
      page: '0',
      limit: '999',
      metaOnly: 'true',
    })).toEqual({
      eventId: 'all',
      page: 1,
      limit: 48,
      metaOnly: true,
    })
  })
})

describe('buildGalleryResponse', () => {
  it('returns metadata-only responses without images', () => {
    const response = buildGalleryResponse(galleryEvents, {
      eventId: 'all',
      page: 1,
      limit: 24,
      metaOnly: true,
    })

    expect(response.events).toHaveLength(2)
    expect(response.images).toEqual([])
    expect(response.total).toBe(0)
    expect(response.revision).toBeNull()
  })

  it('paginates a single event image list', () => {
    const response = buildGalleryResponse(galleryEvents, {
      eventId: 'jmun-2025',
      page: 2,
      limit: 1,
      metaOnly: false,
    })

    expect(response.total).toBe(2)
    expect(response.images).toHaveLength(1)
    expect(response.images[0]?.id).toBe('jmun-2')
    expect(response.revision).toBeNull()
  })
})
