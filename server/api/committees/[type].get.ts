import type { ConferenceType } from '../../../shared/types'
import { getCommittees } from '../../utils/data'

const VALID_TYPES = new Set<ConferenceType>(['JMUN', 'SAMUN'])

export default defineEventHandler((event) => {
  const param = getRouterParam(event, 'type')
  if (!param) {
    throw createError({ statusCode: 400, message: 'Committee type is required' })
  }

  const type = param.toUpperCase() as ConferenceType
  if (!VALID_TYPES.has(type)) {
    throw createError({ statusCode: 400, message: 'Invalid committee type' })
  }

  return getCommittees().filter((committee) => committee.type === type)
})
