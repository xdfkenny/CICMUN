export const formatEventDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  timeZone = 'UTC',
) => {
  if (!startDate || !endDate) return 'Coming Soon'

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Coming Soon'
  }

  const startMonth = start.toLocaleDateString('en-US', { month: 'long', timeZone })
  const endMonth = end.toLocaleDateString('en-US', { month: 'long', timeZone })
  const startDay = Number.parseInt(start.toLocaleDateString('en-US', { day: 'numeric', timeZone }), 10)
  const endDay = Number.parseInt(end.toLocaleDateString('en-US', { day: 'numeric', timeZone }), 10)
  const startYear = start.toLocaleDateString('en-US', { year: 'numeric', timeZone })
  const endYear = end.toLocaleDateString('en-US', { year: 'numeric', timeZone })

  if (startMonth === endMonth) {
    if (startDay === endDay && startYear === endYear) return `${startMonth} ${startDay}, ${startYear}`
    if (startYear === endYear) return `${startMonth} ${startDay}-${endDay}, ${startYear}`
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
  }

  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`
  }

  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`
}
