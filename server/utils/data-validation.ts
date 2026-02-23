import type { Committee, Resource } from '../../shared/types'

export interface EventRecord {
  id: string
  name: string
  description?: string
  startDate: string | null
  endDate: string | null
  timezone: string | null
  location?: string | null
  address?: string | null
  city?: string | null
  mapUrl?: string | null
  externalMapUrl?: string | null
}

interface CommitteesResult {
  committees: Committee[]
  errors: string[]
}

interface EventsResult {
  events: EventRecord[]
  errors: string[]
}

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

    const type = value.type === 'SAMUN' || value.type === 'JMUN' ? value.type : null
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
      chairPhoto: asNullableString(value.chairPhoto),
      coChairName: asTrimmedString(value.coChairName, ''),
      coChairPhoto: asNullableString(value.coChairPhoto),
      secretaryName: asNullableString(value.secretaryName),
      secretaryPhoto: asNullableString(value.secretaryPhoto),
      topicA: asTrimmedString(value.topicA, 'TBA'),
      topicB: asNullableString(value.topicB),
      image: asTrimmedString(value.image, '') || undefined,
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
      mapUrl: asTrimmedString(value.mapUrl, '') || null,
      externalMapUrl: asTrimmedString(value.externalMapUrl, '') || null,
    }]
  })

  return { events, errors }
}
