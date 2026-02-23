import committeesRaw from '../../data/committees.json'
import eventsRaw from '../../data/events.json'
import { normalizeCommittees, normalizeEvents, type EventRecord } from './data-validation'
import type { Committee } from '../../shared/types'

const logValidationErrors = (label: string, errors: string[]) => {
  if (!errors.length) return
  const preview = errors.slice(0, 6).join(' | ')
  const extra = errors.length > 6 ? ` (+${errors.length - 6} more)` : ''
  console.warn(`[data] ${label} validation warnings: ${preview}${extra}`)
}

export const getCommittees = (): Committee[] => {
  const { committees, errors } = normalizeCommittees(committeesRaw)
  logValidationErrors('committees', errors)
  return committees
}

export const getEvents = (): EventRecord[] => {
  const { events, errors } = normalizeEvents(eventsRaw)
  logValidationErrors('events', errors)
  return events
}
