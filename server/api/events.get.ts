import events from '../../data/events.json'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const year = typeof query.year === 'string' ? query.year : null

  if (!year) {
    return events
  }

  return events.filter((item: any) => {
    const dateValue = typeof item.date === 'string' ? item.date : ''
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) {
      return false
    }
    return parsed.getFullYear().toString() === year
  })
})
