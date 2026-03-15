import type { GalleryEvent } from '../../shared/gallery'
import type { ConferenceType, HealthResponse } from '../../shared/types'
import { loadGalleryData } from '../utils/gallery-data'
import { getCommittees, getEvents, getResources } from '../utils/data'
import { getGalleryMetrics } from '../utils/gallery'

const EMPTY_COUNTS: Record<ConferenceType, number> = {
  JMUN: 0,
  SAMUN: 0,
}

export default defineEventHandler((event): HealthResponse => {
  setResponseHeader(event, 'cache-control', 'no-store')

  const committees = getCommittees()
  const events = getEvents()
  const resources = getResources()
  const committeeCounts = committees.reduce<Record<ConferenceType, number>>((counts, committee) => {
    counts[committee.type] += 1
    return counts
  }, { ...EMPTY_COUNTS })
  let galleryMetrics = getGalleryMetrics([] as GalleryEvent[])
  let galleryStatus: HealthResponse['checks']['gallery']['status'] = 'degraded'
  let galleryDetail = 'Gallery metadata is unavailable.'

  try {
    galleryMetrics = getGalleryMetrics(loadGalleryData() as GalleryEvent[])
    galleryStatus = galleryMetrics.imageCount > 0 ? 'ok' : 'degraded'
    galleryDetail = galleryMetrics.imageCount > 0
      ? 'Gallery metadata and thumbnails are available.'
      : 'Gallery metadata is empty.'
  } catch (error) {
    console.error('[health] Failed to load gallery metadata.', error)
  }

  const checks: HealthResponse['checks'] = {
    committees: {
      status: committeeCounts.SAMUN > 0 ? 'ok' : 'degraded',
      detail: committeeCounts.SAMUN > 0
        ? 'JMUN and SAMUN committee datasets are published.'
        : 'JMUN committees are published, but the official SAMUN committee dataset is still missing.',
      counts: committeeCounts,
    },
    events: {
      status: events.length >= 2 ? 'ok' : 'degraded',
      detail: events.length >= 2
        ? 'Event metadata is available for both conference pages.'
        : 'Event metadata is incomplete.',
      count: events.length,
    },
    resources: {
      status: resources.length > 0 ? 'ok' : 'degraded',
      detail: resources.length > 0
        ? 'Delegate resources are available.'
        : 'No delegate resources are currently published.',
      count: resources.length,
    },
    gallery: {
      status: galleryStatus,
      detail: galleryDetail,
      eventCount: galleryMetrics.eventCount,
      imageCount: galleryMetrics.imageCount,
    },
  }

  const status = Object.values(checks).some((check) => check.status === 'degraded')
    ? 'degraded'
    : 'ok'

  return {
    status,
    service: 'cicmun-portal',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? null,
    checks,
  }
})
