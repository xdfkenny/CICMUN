import { formatEventDateRange } from '../utils/formatEventDateRange'
import type { Committee, ConferenceType, PortalEvent } from '~~/shared/types'

const EVENT_IDS: Record<ConferenceType, string> = {
  JMUN: 'jmun',
  SAMUN: 'samun',
}

export const useConferencePage = async (conferenceType: ConferenceType) => {
  const eventId = EVENT_IDS[conferenceType]

  const [
    { data: committees, status, error },
    { data: events },
  ] = await Promise.all([
    useFetch<Committee[]>(`/api/committees/${conferenceType}`, {
      key: `conference-committees-${conferenceType.toLowerCase()}`,
    }),
    useFetch<PortalEvent[]>('/api/events', {
      key: 'conference-events',
    }),
  ])

  const eventDetails = computed(
    () => events.value?.find((event) => event.id === eventId) ?? null,
  )

  const formattedDate = computed(() =>
    formatEventDateRange(
      eventDetails.value?.startDate,
      eventDetails.value?.endDate,
      eventDetails.value?.timezone ?? 'UTC',
    ),
  )

  return {
    committees,
    status,
    error,
    eventDetails,
    formattedDate,
  }
}
