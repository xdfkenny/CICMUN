import type { ConferenceType } from './types'

const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

export const getGeneratedCommitteeImageFilename = (input: {
  id: number
  name: string
  type: ConferenceType
}) => `${input.type.toLowerCase()}-${input.id}-${slugify(input.name)}.svg`

export const getGeneratedCommitteeImagePublicPath = (input: {
  id: number
  name: string
  type: ConferenceType
}) => `/committee-images/generated/${getGeneratedCommitteeImageFilename(input)}`
