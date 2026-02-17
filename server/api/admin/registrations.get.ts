import { requireAuth } from '../../utils/auth'
import { getAdminDb } from '../../utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const decoded = await requireAuth(event)
  const allowed = [
    ...(config.superAdminEmails || []),
    ...(config.adminEmails || []),
  ].map((email: string) => email.toLowerCase())

  if (!decoded.email || !allowed.includes(decoded.email.toLowerCase())) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const db = getAdminDb()
  const snapshot = await db.collection('registrations').orderBy('createdAt', 'desc').get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})
