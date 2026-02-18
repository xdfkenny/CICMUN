import { requireAuth } from '../../../utils/auth'
import { getAdminDb } from '../../../utils/firebaseAdmin'

const ALLOWED_STATUSES = ['approved', 'rejected', 'pending'] as const

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const decoded = await requireAuth(event)
  const normalizeIdList = (value: unknown) => {
    if (Array.isArray(value)) return value
    if (typeof value === 'string') {
      return value.split(',').map(entry => entry.trim()).filter(Boolean)
    }
    return []
  }
  const allowed = [
    ...normalizeIdList(config.superAdminIds),
    ...normalizeIdList(config.adminIds),
  ]

  if (!decoded.uid || !allowed.includes(decoded.uid)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const id = event.context.params?.id
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  const body = await readBody<{ status?: string }>(event)
  if (!body.status || !ALLOWED_STATUSES.includes(body.status as typeof ALLOWED_STATUSES[number])) {
    throw createError({ statusCode: 400, message: 'Invalid status' })
  }

  const db = getAdminDb()
  const docRef = db.collection('registrations').doc(id)
  const snapshot = await docRef.get()
  if (!snapshot.exists) {
    throw createError({ statusCode: 404, message: 'Registration not found' })
  }
  try {
    await docRef.update({
      status: body.status,
      updatedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Failed to update registration', { id, error: err })
    throw createError({ statusCode: 500, message: 'Failed to update registration' })
  }

  return { ok: true }
})
