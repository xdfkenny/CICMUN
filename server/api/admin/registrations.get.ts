import { requireAuth } from '../../utils/auth'
import { getAdminDb } from '../../utils/firebaseAdmin'

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

  const db = getAdminDb()
  const query = getQuery(event)
  const requestedSize = typeof query.pageSize === 'string' ? parseInt(query.pageSize, 10) : NaN
  const pageSize = Number.isFinite(requestedSize) ? Math.min(Math.max(requestedSize, 1), 200) : 50
  let registrationsQuery = db.collection('registrations').orderBy('createdAt', 'desc').limit(pageSize)
  if (typeof query.cursor === 'string' && query.cursor) {
    const cursorSnap = await db.collection('registrations').doc(query.cursor).get()
    if (cursorSnap.exists) {
      registrationsQuery = registrationsQuery.startAfter(cursorSnap)
    }
  }
  const snapshot = await registrationsQuery.get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})
