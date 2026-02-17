import type { H3Event } from 'h3'
import { getAdminAuth } from './firebaseAdmin'

export const getBearerToken = (event: H3Event) => {
  const header = getHeader(event, 'authorization') || ''
  const [type, token] = header.split(' ')
  if (type?.toLowerCase() !== 'bearer' || !token) return null
  return token
}

export const requireAuth = async (event: H3Event) => {
  const token = getBearerToken(event)
  if (!token) {
    throw createError({ statusCode: 401, message: 'Missing auth token' })
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token)
    return decoded
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid auth token' })
  }
}
