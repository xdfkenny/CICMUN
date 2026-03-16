import path from 'node:path'
import { getGeneratedCommitteeImagePublicPath } from '../../shared/committee-images'
import type { Committee, ConferenceType, PortalEvent, PortalResource, Resource } from '../../shared/types'
import publicAssetsRaw from '../../data/public-assets.json'

export type EventRecord = PortalEvent

interface CommitteesResult {
  committees: Committee[]
  errors: string[]
}

interface EventsResult {
  events: EventRecord[]
  errors: string[]
}

interface ResourcesResult {
  resources: PortalResource[]
  errors: string[]
}

const ALLOWED_MAP_HOSTS = new Set(['www.google.com'])
const PUBLIC_ASSETS = new Set(
  Array.isArray(publicAssetsRaw) ? publicAssetsRaw.filter((value): value is string => typeof value === 'string') : [],
)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const asTrimmedString = (value: unknown, fallback = ''): string => {
  const raw = asString(value, fallback)
  const trimmed = raw.trim()
  return trimmed ? trimmed : fallback
}

const asNullableString = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const asConferenceType = (value: unknown): ConferenceType | null =>
  value === 'SAMUN' || value === 'JMUN' ? value : null

const asConferenceList = (value: unknown): ConferenceType[] | undefined => {
  if (!Array.isArray(value)) return undefined

  return value.flatMap((entry) => {
    const conference = asConferenceType(entry)
    return conference ? [conference] : []
  })
}

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const isValidDateString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))

const isSafePublicPath = (value: string) =>
  value.startsWith('/') && !value.startsWith('//') && !value.includes('..')

const hasPublicAssetFile = (publicPath: string) =>
  isSafePublicPath(publicPath) && PUBLIC_ASSETS.has(normalizePublicPath(publicPath))

const normalizePublicPath = (publicPath: string) => {
  const [pathname] = publicPath.split('?')
  const segments = pathname.split('/').filter(Boolean)

  if (!segments.length) return '/'

  try {
    return `/${segments.map((segment) => encodeURIComponent(decodeURIComponent(segment))).join('/')}`
  } catch {
    return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`
  }
}

const sanitizeUrl = (value: unknown, allowedHosts: Set<string>): string | null => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null
  if (isSafePublicPath(trimmed)) return trimmed

  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    if (!allowedHosts.has(parsed.hostname)) return null
    return parsed.toString()
  } catch {
    return null
  }
}

const sanitizePublicAssetSource = (value: unknown, label: string, errors: string[]): string | null => {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null
  if (!isSafePublicPath(trimmed)) {
    errors.push(`${label} must be a local public asset path`)
    return null
  }
  if (!hasPublicAssetFile(trimmed)) {
    errors.push(`${label} file not found: ${trimmed}`)
    return null
  }
  return trimmed
}

const sanitizeCommitteeImageSource = (
  value: unknown,
  committee: Pick<Committee, 'id' | 'name' | 'type'>,
  errors: string[],
): string => {
  const label = `committee:${committee.id}:image`
  const sanitized = sanitizePublicAssetSource(value, label, errors)
  if (sanitized) return sanitized

  if (typeof value === 'string' && value.trim()) {
    errors.push(`${label} falling back to generated local asset`)
  }

  return getGeneratedCommitteeImagePublicPath(committee)
}

const sanitizeOptionalPhoto = (value: unknown, label: string, errors: string[]): string | null => {
  const sanitized = sanitizePublicAssetSource(value, label, errors)
  if (typeof value === 'string' && value.trim() && !sanitized) {
    errors.push(`${label} invalid image source`)
  }
  return sanitized
}

const sanitizeMapUrl = (value: unknown, label: string, errors: string[]): string | null => {
  const sanitized = sanitizeUrl(value, ALLOWED_MAP_HOSTS)
  if (typeof value === 'string' && value.trim() && !sanitized) {
    errors.push(`${label} invalid or disallowed map url`)
  }
  return sanitized
}

const isSafeResourceFilename = (filename: string) =>
  filename === path.basename(filename) && !filename.includes('\0')

const hasPublicResourceFile = (filename: string) =>
  isSafeResourceFilename(filename) && PUBLIC_ASSETS.has(`/resources/${encodeURIComponent(filename)}`)

const parseResource = (value: unknown, index: number, committeeId: number, errors: string[]): Resource | null => {
  if (!isRecord(value)) {
    errors.push(`committee:${committeeId}:resources[${index}] not an object`)
    return null
  }

  const title = asTrimmedString(value.title)
  const filename = asTrimmedString(value.filename)

  if (!title || !filename) {
    errors.push(`committee:${committeeId}:resources[${index}] missing title or filename`)
    return null
  }

  if (!isSafeResourceFilename(filename)) {
    errors.push(`committee:${committeeId}:resources[${index}] invalid filename`)
    return null
  }

  if (!hasPublicResourceFile(filename)) {
    errors.push(`committee:${committeeId}:resources[${index}] file not found: ${filename}`)
    return null
  }

  return {
    title,
    description: asString(value.description, ''),
    filename,
  }
}

export const normalizeCommittees = (raw: unknown): CommitteesResult => {
  if (!Array.isArray(raw)) {
    return { committees: [], errors: ['committees: expected array'] }
  }

  const errors: string[] = []
  const committees = raw.flatMap((value, index) => {
    if (!isRecord(value)) {
      errors.push(`committees[${index}] not an object`)
      return []
    }

    const id = asNumber(value.id)
    if (id === null) {
      errors.push(`committees[${index}] missing valid id`)
      return []
    }

    const name = asTrimmedString(value.name)
    if (!name) {
      errors.push(`committee:${id} missing name`)
      return []
    }

    const type = asConferenceType(value.type)
    if (!type) {
      errors.push(`committee:${id} missing valid type`)
      return []
    }

    const resources = Array.isArray(value.resources)
      ? value.resources
          .map((resource, resourceIndex) => parseResource(resource, resourceIndex, id, errors))
          .filter((resource): resource is Resource => resource !== null)
      : undefined

    return [{
      id,
      name,
      type,
      chairName: asTrimmedString(value.chairName, ''),
      chairPhoto: sanitizeOptionalPhoto(value.chairPhoto, `committee:${id}:chairPhoto`, errors),
      coChairName: asTrimmedString(value.coChairName, ''),
      coChairPhoto: sanitizeOptionalPhoto(value.coChairPhoto, `committee:${id}:coChairPhoto`, errors),
      secretaryName: asNullableString(value.secretaryName),
      secretaryPhoto: sanitizeOptionalPhoto(value.secretaryPhoto, `committee:${id}:secretaryPhoto`, errors),
      topicA: asTrimmedString(value.topicA, 'TBA'),
      topicB: asNullableString(value.topicB),
      image: sanitizeCommitteeImageSource(value.image, { id, name, type }, errors),
      summary: asTrimmedString(value.summary, '') || undefined,
      resources: resources?.length ? resources : undefined,
    }]
  })

  return { committees, errors }
}

export const normalizeEvents = (raw: unknown): EventsResult => {
  if (!Array.isArray(raw)) {
    return { events: [], errors: ['events: expected array'] }
  }

  const errors: string[] = []
  const events = raw.flatMap((value, index) => {
    if (!isRecord(value)) {
      errors.push(`events[${index}] not an object`)
      return []
    }

    const id = asTrimmedString(value.id)
    const name = asTrimmedString(value.name)
    if (!id || !name) {
      errors.push(`events[${index}] missing id or name`)
      return []
    }

    const startDate = isValidDateString(value.startDate) ? value.startDate : null
    const endDate = isValidDateString(value.endDate) ? value.endDate : null
    const timezone = asTrimmedString(value.timezone, '') || null

    let hasRequiredError = false
    if (!startDate) {
      errors.push(`event:${id} missing or invalid startDate`)
      hasRequiredError = true
    }
    if (!endDate) {
      errors.push(`event:${id} missing or invalid endDate`)
      hasRequiredError = true
    }
    if (!timezone) {
      errors.push(`event:${id} missing timezone`)
      hasRequiredError = true
    }

    if (hasRequiredError) {
      return []
    }

    return [{
      id,
      name,
      description: asTrimmedString(value.description, '') || undefined,
      startDate,
      endDate,
      timezone,
      location: asTrimmedString(value.location, '') || null,
      address: asTrimmedString(value.address, '') || null,
      city: asTrimmedString(value.city, '') || null,
      mapUrl: sanitizeMapUrl(value.mapUrl, `event:${id}:mapUrl`, errors),
      externalMapUrl: sanitizeMapUrl(value.externalMapUrl, `event:${id}:externalMapUrl`, errors),
    }]
  })

  return { events, errors }
}

export const normalizeResources = (raw: unknown): ResourcesResult => {
  if (!Array.isArray(raw)) {
    return { resources: [], errors: ['resources: expected array'] }
  }

  const errors: string[] = []
  const resources = raw.flatMap((value, index) => {
    if (!isRecord(value)) {
      errors.push(`resources[${index}] not an object`)
      return []
    }

    const id = asTrimmedString(value.id)
    const title = asTrimmedString(value.title)
    const description = asTrimmedString(value.description)
    const category = asTrimmedString(value.category, 'General')
    const filename = asTrimmedString(value.filename)

    if (!id || !title || !filename) {
      errors.push(`resources[${index}] missing id, title, or filename`)
      return []
    }

    if (!isSafeResourceFilename(filename)) {
      errors.push(`resources:${id} invalid filename`)
      return []
    }

    if (!hasPublicResourceFile(filename)) {
      errors.push(`resources:${id} file not found: ${filename}`)
      return []
    }

    const conferences = asConferenceList(value.conferences)
    if (Array.isArray(value.conferences) && conferences?.length !== value.conferences.length) {
      errors.push(`resources:${id} contains invalid conference identifiers`)
    }

    return [{
      id,
      title,
      description,
      category,
      filename,
      conferences: conferences?.length ? conferences : undefined,
    }]
  })

  return { resources, errors }
}
