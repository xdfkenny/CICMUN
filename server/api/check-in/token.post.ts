import { createHmac } from 'node:crypto'
import { requireAuth } from '../../utils/auth'

const MAX_SKEW_MS = 2 * 60 * 1000

export default defineEventHandler(async (event) => {
  const decoded = await requireAuth(event)
  if (!decoded.uid) {
    throw createError({ statusCode: 401, message: 'Missing user id' })
  }

  const body = await readBody<{ uid?: string; ts?: string }>(event)
  if (!body?.uid || !body?.ts) {
    throw createError({ statusCode: 400, message: 'Missing payload' })
  }
  if (body.uid !== decoded.uid) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const tsMs = Date.parse(body.ts)
  if (!Number.isFinite(tsMs)) {
    throw createError({ statusCode: 400, message: 'Invalid timestamp' })
  }
  if (Math.abs(Date.now() - tsMs) > MAX_SKEW_MS) {
    throw createError({ statusCode: 400, message: 'Timestamp out of range' })
  }

  const { checkInSecret } = useRuntimeConfig()
  if (!checkInSecret) {
    throw createError({ statusCode: 500, message: 'Check-in signature is not configured' })
  }

  const token = createHmac('sha256', checkInSecret)
    .update(`${body.uid}|${body.ts}`)
    .digest('base64url')

  return { token }
})
