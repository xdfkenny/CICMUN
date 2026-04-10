import committeesRaw from '../../data/committees.json'
import eventsRaw from '../../data/events.json'
import resourcesRaw from '../../data/resources.json'
import { normalizeCommittees, normalizeEvents, normalizeResources, type EventRecord } from './data-validation'
import type { Committee, PortalResource } from '../../shared/types'

const loggedValidationLabels = new Set<string>()
let committeesCache: Committee[] | null = null
let eventsCache: EventRecord[] | null = null
let resourcesCache: PortalResource[] | null = null
const isProduction = process.env.NODE_ENV === 'production'

const logValidationErrors = (label: string, errors: string[]) => {
  if (!errors.length || loggedValidationLabels.has(label)) return
  const preview = errors.slice(0, 6).join(' | ')
  const extra = errors.length > 6 ? ` (+${errors.length - 6} more)` : ''
  console.warn(`[data] ${label} validation warnings: ${preview}${extra}`)
  loggedValidationLabels.add(label)
}

export const getCommittees = (): Committee[] => {
  if (isProduction && committeesCache) return committeesCache
  const { committees, errors } = normalizeCommittees(committeesRaw)
  logValidationErrors('committees', errors)
  if (isProduction) {
    committeesCache = committees
  }
  return committees
}

export const getEvents = (): EventRecord[] => {
  if (isProduction && eventsCache) return eventsCache
  const { events, errors } = normalizeEvents(eventsRaw)
  logValidationErrors('events', errors)
  if (isProduction) {
    eventsCache = events
  }
  return events
}

export const getResources = (): PortalResource[] => {
  if (isProduction && resourcesCache) return resourcesCache
  const { resources, errors } = normalizeResources(resourcesRaw)
  logValidationErrors('resources', errors)
  if (isProduction) {
    resourcesCache = resources
  }
  return resources
}
